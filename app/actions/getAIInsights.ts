'use server';

import { checkUsers } from '@/lib/checkUsers';
import { db } from '@/lib/db';
import { generateExpenseInsights, AIInsight, ExpenseRecord } from '@/lib/ai';

export async function getAIInsights(): Promise<AIInsight[]> {
  try {
    const user = await checkUsers();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [expenses, monthAgg, fullUser] = await Promise.all([
      db.record.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: thirtyDaysAgo },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      db.record.aggregate({
        where: {
          userId: user.id,
          date: { gte: monthStart },
        },
        _sum: { amount: true },
      }),
      db.user.findUnique({
        where: { id: user.id },
        select: { monthlyIncome: true, savingsGoal: true },
      }),
    ]);

    if (expenses.length === 0) {
      const income = fullUser?.monthlyIncome;
      return [
        {
          id: 'welcome-1',
          type: 'info',
          title: 'Ready to track',
          message: income
            ? `Your monthly income is set to ₹${income.toLocaleString('en-IN')}. Add expenses to see what’s left and whether you’re hitting your savings goal.`
            : 'Start adding expenses to get personalized insights.',
          action: 'Add your first expense',
          confidence: 1.0,
        },
        {
          id: 'welcome-2',
          type: 'tip',
          title: 'Log daily',
          message:
            'OTT, shopping, recharge — regularly log karoge toh AI better suggestions degi.',
          action: 'Set a daily habit',
          confidence: 1.0,
        },
      ];
    }

    const expenseData: ExpenseRecord[] = expenses.map((expense) => ({
      id: expense.id,
      amount: expense.amount,
      category: expense.category || 'Other',
      description: expense.text,
      date: expense.createdAt.toISOString(),
    }));

    const insights = await generateExpenseInsights(expenseData, {
      monthlyIncome: fullUser?.monthlyIncome,
      savingsGoal: fullUser?.savingsGoal,
      spentThisMonth: monthAgg._sum.amount ?? 0,
    });
    return insights;
  } catch (error) {
    console.error('Error getting AI insights:', error);

    return [
      {
        id: 'error-1',
        type: 'warning',
        title: 'Insights Temporarily Unavailable',
        message:
          "We're having trouble analyzing your expenses right now. Please try again in a few minutes.",
        action: 'Retry analysis',
        confidence: 0.5,
      },
    ];
  }
}
