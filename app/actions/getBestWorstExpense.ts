'use server';
import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';

async function getBestWorstExpense(): Promise<{
  bestExpense?: number;
  worstExpense?: number;
  error?: string;
}> {
  const user = await checkUsers();

  if (!user) {
    return { error: 'User not found' };
  }

  try {
    const records = await db.record.findMany({
      where: { userId: user.id },
      select: { amount: true },
    });

    if (records.length === 0) {
      return {};
    }

    const amounts = records.map((r) => r.amount);
    return {
      bestExpense: Math.max(...amounts),
      worstExpense: Math.min(...amounts),
    };
  } catch (error) {
    console.error('Error fetching expense range:', error);
    return { error: 'Database error' };
  }
}

export default getBestWorstExpense;
