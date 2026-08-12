import { db } from '@/lib/db';
import type { Record } from '@/types/Record';
import type { MonthlyOverviewData } from '@/app/actions/getMonthlyOverview';

function monthBounds(year: number, month: number) {
  const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));
  return { start, end };
}

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
};

/** One DB round-trip for the signed-in dashboard */
export async function getDashboardData(userId: string): Promise<DashboardData> {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const { start, end } = monthBounds(year, month);

  const [records, monthRecords] = await Promise.all([
    db.record.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 200,
    }),
    db.record.findMany({
      where: {
        userId,
        date: { gte: start, lt: end },
      },
      orderBy: { date: 'desc' },
    }),
  ]);

  const amounts = records.map((r) => r.amount);
  const uniqueDays = new Set(
    records
      .filter((r) => r.amount > 0)
      .map((r) => {
        const d = new Date(r.date);
        return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
      })
  );

  return {
    records,
    totalSpent: amounts.reduce((sum, n) => sum + n, 0),
    daysWithRecords: uniqueDays.size,
    bestExpense: amounts.length ? Math.max(...amounts) : undefined,
    worstExpense: amounts.length ? Math.min(...amounts) : undefined,
    monthly: buildMonthlyOverview(monthRecords, year, month),
  };
}
