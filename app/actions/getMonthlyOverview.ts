'use server';

import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';

export type CategorySpend = {
  category: string;
  amount: number;
  count: number;
};

export type MerchantSpend = {
  merchant: string;
  amount: number;
  count: number;
};

export type MonthlyOverviewData = {
  monthLabel: string;
  year: number;
  month: number;
  total: number;
  count: number;
  byCategory: CategorySpend[];
  topMerchants: MerchantSpend[];
};

function monthBounds(year: number, month: number) {
  const start = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0));
  return { start, end };
}

export async function getMonthlyOverview(
  year?: number,
  month?: number
): Promise<{ data?: MonthlyOverviewData; error?: string }> {
  try {
    const user = await checkUsers();
    if (!user) {
      return { error: 'Please sign in' };
    }

    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month ?? now.getMonth();
    const { start, end } = monthBounds(y, m);

    const records = await db.record.findMany({
      where: {
        userId: user.id,
        date: { gte: start, lt: end },
      },
      orderBy: { date: 'desc' },
    });

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
        const key = merchant;
        const mPrev = merchantMap.get(key) || { amount: 0, count: 0 };
        merchantMap.set(key, {
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

    const monthLabel = new Date(Date.UTC(y, m, 1)).toLocaleString('en-IN', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });

    return {
      data: {
        monthLabel,
        year: y,
        month: m,
        total,
        count: records.length,
        byCategory,
        topMerchants,
      },
    };
  } catch (error) {
    console.error('getMonthlyOverview error:', error);
    return { error: 'Could not load monthly overview' };
  }
}
