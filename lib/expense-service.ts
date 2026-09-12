import { db } from '@/lib/db';
import { defaultIsCommitted } from '@/lib/playMoney';
import {
  expenseFingerprint,
  isSameUpiPayment,
  normalizeUpiRef,
} from '@/lib/upiDedupe';

export type ExpenseInput = {
  text?: string;
  amount?: number;
  category?: string;
  date?: string;
  merchant?: string;
  paymentMethod?: string;
  note?: string;
  isCommitted?: boolean;
  upiRef?: string;
  fromScreenshot?: boolean;
};

export function serializeRecord(record: {
  id: string;
  text: string;
  amount: number;
  category: string;
  merchant?: string | null;
  paymentMethod?: string | null;
  note?: string | null;
  date: Date | string | number;
  userId: string;
  recurringExpenseId?: string | null;
  isCommitted?: boolean;
  upiRef?: string | null;
  fingerprint?: string | null;
  createdAt: Date | string | number;
}) {
  return {
    id: record.id,
    text: record.text,
    amount: record.amount,
    category: record.category,
    merchant: record.merchant ?? null,
    paymentMethod: record.paymentMethod ?? null,
    note: record.note ?? null,
    date: new Date(record.date).toISOString(),
    userId: record.userId,
    recurringExpenseId: record.recurringExpenseId ?? null,
    isCommitted: record.isCommitted ?? false,
    upiRef: record.upiRef ?? null,
    fingerprint: record.fingerprint ?? null,
    createdAt: new Date(record.createdAt).toISOString(),
  };
}

export function parseYmdToUtcNoon(dateStr: string): Date | null {
  const [year, month, day] = String(dateStr || '').split('-');
  if (!year || !month || !day) return null;
  const dateObj = new Date(
    Date.UTC(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      12,
      0,
      0
    )
  );
  return Number.isNaN(dateObj.getTime()) ? null : dateObj;
}

async function loadRecentForUser(userId: string) {
  const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  return db.record.findMany({
    where: { userId, date: { gte: since } },
    select: {
      text: true,
      amount: true,
      merchant: true,
      date: true,
      upiRef: true,
      fingerprint: true,
    },
    take: 400,
  });
}

export async function listExpenses(userId: string, take = 200) {
  const records = await db.record.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take,
  });
  return records.map(serializeRecord);
}

export async function createExpense(userId: string, input: ExpenseInput) {
  const text = String(input.text || '').trim();
  const category = String(input.category || '').trim();
  const amount = Number(input.amount);
  const date = parseYmdToUtcNoon(String(input.date || ''));
  const merchant = input.merchant?.toString().trim() || null;
  const paymentMethod = input.paymentMethod?.toString().trim() || null;
  const note = input.note?.toString().trim() || null;

  if (!text || !category || !input.date) {
    return {
      ok: false as const,
      error: 'Description, amount, category, or date is missing',
    };
  }
  if (Number.isNaN(amount) || amount < 0) {
    return { ok: false as const, error: 'Enter a valid amount' };
  }
  if (!date) {
    return { ok: false as const, error: 'Invalid date format' };
  }

  const isCommitted =
    typeof input.isCommitted === 'boolean'
      ? input.isCommitted
      : defaultIsCommitted(category, text, merchant || '');

  const upiRef = input.upiRef
    ? normalizeUpiRef(input.upiRef.toString()) || null
    : null;
  const fingerprint = expenseFingerprint({
    amount,
    merchant: merchant || text,
    text,
    date,
    upiRef,
  });

  if (upiRef || input.fromScreenshot) {
    const recent = await loadRecentForUser(userId);
    const dup = recent.find((row) =>
      isSameUpiPayment(
        {
          amount,
          merchant: merchant || text,
          text,
          date,
          upiRef,
          fingerprint,
        },
        row
      )
    );
    if (dup) {
      return {
        ok: false as const,
        error: `Already logged — ${dup.text} · ₹${dup.amount}. Duplicate UPI skipped.`,
      };
    }
  }

  const created = await db.record.create({
    data: {
      text,
      amount,
      category,
      merchant,
      paymentMethod,
      note,
      date,
      userId,
      isCommitted,
      upiRef,
      fingerprint,
    },
  });

  return { ok: true as const, record: serializeRecord(created) };
}

export async function updateExpense(
  userId: string,
  recordId: string,
  input: ExpenseInput
) {
  const existing = await db.record.findFirst({
    where: { id: recordId, userId },
  });
  if (!existing) {
    return { ok: false as const, error: 'Expense not found' };
  }

  const text = String(input.text || '').trim();
  const category = String(input.category || '').trim();
  const amount = Number(input.amount);
  const date = parseYmdToUtcNoon(String(input.date || ''));

  if (!text) return { ok: false as const, error: 'Description is required' };
  if (!category) return { ok: false as const, error: 'Category is required' };
  if (Number.isNaN(amount) || amount < 0) {
    return { ok: false as const, error: 'Enter a valid amount' };
  }
  if (!date) return { ok: false as const, error: 'Invalid date format' };

  const updated = await db.record.update({
    where: { id: recordId },
    data: {
      text,
      amount,
      category,
      merchant: input.merchant?.toString().trim() || null,
      paymentMethod: input.paymentMethod?.toString().trim() || null,
      note: input.note?.toString().trim() || null,
      date,
      isCommitted:
        typeof input.isCommitted === 'boolean'
          ? input.isCommitted
          : existing.isCommitted,
    },
  });

  return { ok: true as const, record: serializeRecord(updated) };
}

export async function deleteExpense(userId: string, recordId: string) {
  const existing = await db.record.findFirst({
    where: { id: recordId, userId },
  });
  if (!existing) {
    return {
      ok: false as const,
      error:
        'Record not found or you do not have permission to delete this record.',
    };
  }

  await db.record.delete({ where: { id: recordId } });
  return { ok: true as const, message: 'Record deleted successfully' };
}
