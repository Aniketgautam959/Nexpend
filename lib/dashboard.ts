import { db } from '@/lib/db';
import type { Record } from '@/types/Record';
import type { MonthlyOverviewData } from '@/app/actions/getMonthlyOverview';
import {
  computePlayMoney,
  istMonthBounds,
  istWeekStart,
  ymdToUtcStart,
  type PlayMoneySnapshot,
} from '@/lib/playMoney';

function buildMonthlyOverview(
  records: Array<{
    amount: number;
    category: string | null;
    merchant: string | null;
    text: string;
    date: Date | null;
  }>,
  year: number,
  month: number
): MonthlyOverviewData {
  const categoryMap = new Map<string, { amount: number; count: number }>();
  const merchantMap = new Map<string, { amount: number; count: number }>();
  let total = 0;

  for (const r of records) {
    total += r.amount;
    const cat = r.category || 'Other';
    const prev = categoryMap.get(cat) || { amount: 0, count: 0 };
    categoryMap.set(cat, {
      amount: prev.amount + r.amount,
      count: prev.count + 1,
    });

    const merchant = (r.merchant || r.text || '').trim();
    if (merchant) {
      const mPrev = merchantMap.get(merchant) || { amount: 0, count: 0 };
      merchantMap.set(merchant, {
        amount: mPrev.amount + r.amount,
        count: mPrev.count + 1,
      });
    }
  }

  const byCategory = Array.from(categoryMap.entries())
    .map(([category, v]) => ({ category, ...v }))
    .sort((a, b) => b.amount - a.amount);

  const topMerchants = Array.from(merchantMap.entries())
    .map(([merchant, v]) => ({ merchant, ...v }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const monthLabel = new Date(Date.UTC(year, month, 1)).toLocaleString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return {
    monthLabel,
    year,
    month,
    total,
    count: records.length,
    byCategory,
    topMerchants,
  };
}

export type DashboardData = {
  records: Record[];
  totalSpent: number;
  daysWithRecords: number;
  bestExpense?: number;
  worstExpense?: number;
  monthly: MonthlyOverviewData;
  play: PlayMoneySnapshot;
};

/** One DB round-trip for the signed-in dashboard */
export async function getDashboardData(
  userId: string,
  opts?: { monthlyIncome?: number | null; savingsGoal?: number | null }
): Promise<DashboardData> {
  const now = new Date();
  const { today, startDate, endDate } = istMonthBounds(now);
  const weekStart = ymdToUtcStart(istWeekStart(today));
  const rangeStart =
    weekStart.getTime() < startDate.getTime() ? weekStart : startDate;

  const [records, rangeRecords, recurring] = await Promise.all([
    db.record.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 200,
    }),
    db.record.findMany({
      where: {
        userId,
        date: { gte: rangeStart, lt: endDate },
      },
      orderBy: { date: 'desc' },
    }),
    db.recurringExpense.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        isActive: true,
        isCommitted: true,
      },
    }),
  ]);

  const monthRecords = rangeRecords.filter((r) => {
    const t = r.date.getTime();
    return t >= startDate.getTime() && t < endDate.getTime();
  });

  const amounts = records.map((r) => r.amount);
  const uniqueDays = new Set(
    records
      .filter((r) => r.amount > 0)
      .map((r) => {
        const d = new Date(r.date);
        return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
      })
  );

  const play = computePlayMoney({
    monthlyIncome: opts?.monthlyIncome ?? 0,
    savingsGoal: opts?.savingsGoal ?? 0,
    recurring,
    records: rangeRecords,
    now,
  });

  return {
    records,
    totalSpent: amounts.reduce((sum, n) => sum + n, 0),
    daysWithRecords: uniqueDays.size,
    bestExpense: amounts.length ? Math.max(...amounts) : undefined,
    worstExpense: amounts.length ? Math.min(...amounts) : undefined,
    monthly: buildMonthlyOverview(monthRecords, today.y, today.m - 1),
    play,
  };
}
