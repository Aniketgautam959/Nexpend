'use server';

import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';
import { revalidatePath } from 'next/cache';

interface UpdateResult {
  error?: string;
  message?: string;
}

export async function updateExpenseRecord(
  recordId: string,
  input: {
    text: string;
    amount: number;
    category: string;
    merchant?: string;
    paymentMethod?: string;
    note?: string;
    date: string;
  }
): Promise<UpdateResult> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    const text = input.text?.trim();
    if (!text) return { error: 'Description is required' };
    if (!input.category) return { error: 'Category is required' };
    if (Number.isNaN(input.amount) || input.amount < 0) {
      return { error: 'Enter a valid amount' };
    }
    if (!input.date) return { error: 'Date is required' };

    const existing = await db.record.findFirst({
      where: { id: recordId, userId: user.id },
    });
    if (!existing) return { error: 'Expense not found' };

    let date: string;
    try {
      const [year, month, day] = input.date.split('-');
      const dateObj = new Date(
        Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)
      );
      date = dateObj.toISOString();
    } catch {
      return { error: 'Invalid date format' };
    }

    await db.record.update({
      where: { id: recordId },
      data: {
        text,
        amount: input.amount,
        category: input.category,
        merchant: input.merchant?.trim() || null,
        paymentMethod: input.paymentMethod?.trim() || null,
        note: input.note?.trim() || null,
        date,
      },
    });

    revalidatePath('/');
    return { message: 'Updated' };
  } catch (error) {
    console.error('updateExpenseRecord:', error);
    return { error: 'Could not update expense' };
  }
}
