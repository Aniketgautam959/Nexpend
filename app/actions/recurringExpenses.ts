'use server';

import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';
import { revalidatePath } from 'next/cache';
import { defaultIsCommitted } from '@/lib/playMoney';
import { expenseFingerprint } from '@/lib/upiDedupe';

export type RecurringExpenseDTO = {
  id: string;
  text: string;
  amount: number;
  category: string;
  merchant: string | null;
  paymentMethod: string | null;
  note: string | null;
  dayOfMonth: number;
  nextRunAt: string;
  isActive: boolean;
  isCommitted: boolean;
};

function clampDay(day: number) {
  return Math.min(28, Math.max(1, Math.floor(day)));
}

/** Next UTC noon on dayOfMonth on/after from */
function computeNextRunAt(dayOfMonth: number, from = new Date()): Date {
  const day = clampDay(dayOfMonth);
  const y = from.getUTCFullYear();
  const m = from.getUTCMonth();
  const candidate = new Date(Date.UTC(y, m, day, 12, 0, 0));

  if (candidate.getTime() > from.getTime()) {
    return candidate;
  }

  // Already passed this month → next month
  return new Date(Date.UTC(y, m + 1, day, 12, 0, 0));
}

function advanceOneMonth(date: Date, dayOfMonth: number): Date {
  const day = clampDay(dayOfMonth);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, day, 12, 0, 0)
  );
}

export async function getRecurringExpenses(): Promise<{
  items?: RecurringExpenseDTO[];
  error?: string;
}> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    const rows = await db.recurringExpense.findMany({
      where: { userId: user.id },
      orderBy: [{ isActive: 'desc' }, { dayOfMonth: 'asc' }],
    });

    return {
      items: rows.map((r) => ({
        id: r.id,
        text: r.text,
        amount: r.amount,
        category: r.category,
        merchant: r.merchant,
        paymentMethod: r.paymentMethod,
        note: r.note,
        dayOfMonth: r.dayOfMonth,
        nextRunAt: r.nextRunAt.toISOString(),
        isActive: r.isActive,
        isCommitted: r.isCommitted,
      })),
    };
  } catch (error) {
    console.error('getRecurringExpenses:', error);
    return { error: 'Could not load recurring expenses' };
  }
}

export async function addRecurringExpense(input: {
  text: string;
  amount: number;
  category: string;
  merchant?: string;
  paymentMethod?: string;
  note?: string;
  dayOfMonth: number;
  isCommitted?: boolean;
}): Promise<{ error?: string; id?: string }> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    const text = input.text?.trim();
    if (!text) return { error: 'Name is required' };
    if (!input.amount || input.amount <= 0) return { error: 'Enter a valid amount' };

    const dayOfMonth = clampDay(input.dayOfMonth || 1);
    const nextRunAt = computeNextRunAt(dayOfMonth);
    const isCommitted =
      typeof input.isCommitted === 'boolean'
        ? input.isCommitted
        : defaultIsCommitted(input.category || 'Subscriptions', text);

    const created = await db.recurringExpense.create({
      data: {
        text,
        amount: input.amount,
        category: input.category || 'Subscriptions',
        merchant: input.merchant?.trim() || null,
        paymentMethod: input.paymentMethod?.trim() || null,
        note: input.note?.trim() || 'Recurring',
        dayOfMonth,
        nextRunAt,
        isCommitted,
        userId: user.id,
      },
    });

    revalidatePath('/');
    return { id: created.id };
  } catch (error) {
    console.error('addRecurringExpense:', error);
    return { error: 'Could not save recurring expense' };
  }
}

export async function toggleRecurringExpense(
  id: string
): Promise<{ error?: string }> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    const row = await db.recurringExpense.findFirst({
      where: { id, userId: user.id },
    });
    if (!row) return { error: 'Not found' };

    const isActive = !row.isActive;
    await db.recurringExpense.update({
      where: { id },
      data: {
        isActive,
        // When re-enabling, schedule from today
        ...(isActive ? { nextRunAt: computeNextRunAt(row.dayOfMonth) } : {}),
      },
    });

    revalidatePath('/');
    return {};
  } catch (error) {
    console.error('toggleRecurringExpense:', error);
    return { error: 'Could not update' };
  }
}

export async function setRecurringCommitted(
  id: string,
  isCommitted: boolean
): Promise<{ error?: string }> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    const row = await db.recurringExpense.findFirst({
      where: { id, userId: user.id },
    });
    if (!row) return { error: 'Not found' };

    await db.recurringExpense.update({
      where: { id },
      data: { isCommitted },
    });

    revalidatePath('/');
    return {};
  } catch (error) {
    console.error('setRecurringCommitted:', error);
    return { error: 'Could not update' };
  }
}

export async function deleteRecurringExpense(
  id: string
): Promise<{ error?: string }> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    await db.recurringExpense.deleteMany({
      where: { id, userId: user.id },
    });

    revalidatePath('/');
    return {};
  } catch (error) {
    console.error('deleteRecurringExpense:', error);
    return { error: 'Could not delete' };
  }
}

/**
 * Auto-log any due recurring expenses (runs on dashboard load).
 * Catches up missed months (max 6) so inactive periods don't flood.
 */
export async function processDueRecurringExpenses(): Promise<{
  logged: number;
  error?: string;
}> {
  try {
    const user = await checkUsers();
    if (!user) return { logged: 0 };

    const now = new Date();
    const due = await db.recurringExpense.findMany({
      where: {
        userId: user.id,
        isActive: true,
        nextRunAt: { lte: now },
      },
    });

    let logged = 0;

    for (const item of due) {
      let next = new Date(item.nextRunAt);
      let safety = 0;

      while (next.getTime() <= now.getTime() && safety < 6) {
        await db.record.create({
          data: {
            text: item.text,
            amount: item.amount,
            category: item.category,
            merchant: item.merchant,
            paymentMethod: item.paymentMethod,
            note: item.note
              ? `${item.note} · auto`
              : 'Auto-logged from recurring',
            date: next,
            userId: user.id,
            recurringExpenseId: item.id,
            isCommitted: item.isCommitted,
            fingerprint: expenseFingerprint({
              amount: item.amount,
              merchant: item.merchant || item.text,
              text: item.text,
              date: next,
            }),
          },
        });
        logged += 1;
        next = advanceOneMonth(next, item.dayOfMonth);
        safety += 1;
      }

      // If still behind after cap, jump to next future occurrence
      while (next.getTime() <= now.getTime()) {
        next = advanceOneMonth(next, item.dayOfMonth);
      }

      await db.recurringExpense.update({
        where: { id: item.id },
        data: { nextRunAt: next },
      });
    }

    return { logged };
  } catch (error) {
    console.error('processDueRecurringExpenses:', error);
    return { logged: 0, error: 'Could not process recurring expenses' };
  }
}
