'use server';

import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';
import { revalidatePath } from 'next/cache';

export type CategoryBudgetRow = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  pct: number;
};

export async function getCategoryBudgets(): Promise<{
  items?: CategoryBudgetRow[];
  error?: string;
}> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    const now = new Date();
    const start = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
    const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));

    const [budgets, monthRecords] = await Promise.all([
      db.categoryBudget.findMany({
        where: { userId: user.id },
        orderBy: { category: 'asc' },
      }),
      db.record.findMany({
        where: {
          userId: user.id,
          date: { gte: start, lt: end },
        },
        select: { category: true, amount: true },
      }),
    ]);

    const spentMap = new Map<string, number>();
    for (const r of monthRecords) {
      const cat = r.category || 'Other';
      spentMap.set(cat, (spentMap.get(cat) || 0) + r.amount);
    }

    return {
      items: budgets.map((b) => {
        const spent = spentMap.get(b.category) || 0;
        const pct =
          b.amount > 0 ? Math.min(999, Math.round((spent / b.amount) * 100)) : 0;
        return {
          id: b.id,
          category: b.category,
          amount: b.amount,
          spent,
          pct,
        };
      }),
    };
  } catch (error) {
    console.error('getCategoryBudgets:', error);
    return { error: 'Could not load category budgets' };
  }
}

export async function upsertCategoryBudget(input: {
  category: string;
  amount: number;
}): Promise<{ error?: string }> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    const category = input.category?.trim();
    if (!category) return { error: 'Pick a category' };
    if (!input.amount || input.amount <= 0) {
      return { error: 'Enter a valid budget amount' };
    }

    await db.categoryBudget.upsert({
      where: {
        userId_category: {
          userId: user.id,
          category,
        },
      },
      create: {
        userId: user.id,
        category,
        amount: input.amount,
      },
      update: {
        amount: input.amount,
      },
    });

    revalidatePath('/');
    return {};
  } catch (error) {
    console.error('upsertCategoryBudget:', error);
    return { error: 'Could not save budget' };
  }
}

export async function deleteCategoryBudget(
  id: string
): Promise<{ error?: string }> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    await db.categoryBudget.deleteMany({
      where: { id, userId: user.id },
    });

    revalidatePath('/');
    return {};
  } catch (error) {
    console.error('deleteCategoryBudget:', error);
    return { error: 'Could not delete budget' };
  }
}
