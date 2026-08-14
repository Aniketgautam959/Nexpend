'use server';

import { db } from '@/lib/db';
import { checkUsers } from '@/lib/checkUsers';
import { defaultIsCommitted } from '@/lib/playMoney';
import {
  expenseFingerprint,
  isSameUpiPayment,
  normalizeUpiRef,
} from '@/lib/upiDedupe';
import { revalidatePath } from 'next/cache';

export type DumpExpenseInput = {
  description: string;
  amount: number;
  category: string;
  merchant?: string;
  paymentMethod?: string;
  note?: string;
  date: string;
  upiRef?: string;
  isCommitted?: boolean;
  allowDuplicate?: boolean;
};

export type DumpDuplicateHit = {
  index: number;
  duplicate: boolean;
  reason?: string;
};

function toUtcNoon(dateStr: string): Date | null {
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return null;
  const dateObj = new Date(
    Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), 12, 0, 0)
  );
  return Number.isNaN(dateObj.getTime()) ? null : dateObj;
}

async function loadRecentForUser(userId: string) {
  const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  return db.record.findMany({
    where: { userId, date: { gte: since } },
    select: {
      id: true,
      text: true,
      amount: true,
      merchant: true,
      date: true,
      upiRef: true,
      fingerprint: true,
    },
    orderBy: { date: 'desc' },
    take: 400,
  });
}

function matchAgainst(
  item: DumpExpenseInput,
  date: Date,
  pool: Array<{
    text: string;
    amount: number;
    merchant: string | null;
    date: Date;
    upiRef: string | null;
    fingerprint: string | null;
  }>
) {
  const upiRef = item.upiRef ? normalizeUpiRef(item.upiRef) : '';
  const candidate = {
    amount: item.amount,
    merchant: item.merchant || item.description,
    text: item.description,
    date,
    upiRef: upiRef || null,
    fingerprint: expenseFingerprint({
      amount: item.amount,
      merchant: item.merchant || item.description,
      text: item.description,
      date,
      upiRef: upiRef || null,
    }),
  };

  return pool.find((row) =>
    isSameUpiPayment(candidate, {
      amount: row.amount,
      merchant: row.merchant,
      text: row.text,
      date: row.date,
      upiRef: row.upiRef,
      fingerprint: row.fingerprint,
    })
  );
}

export async function checkDumpDuplicates(
  items: DumpExpenseInput[]
): Promise<{ hits?: DumpDuplicateHit[]; error?: string }> {
  try {
    const user = await checkUsers();
    if (!user) return { error: 'Please sign in' };

    const recent = await loadRecentForUser(user.id);
    const batch: typeof recent = [];
    const hits: DumpDuplicateHit[] = [];

    items.forEach((item, index) => {
      const date = toUtcNoon(item.date);
      if (!date || !item.amount) {
        hits.push({ index, duplicate: false });
        return;
      }

      const existing = matchAgainst(item, date, [...recent, ...batch]);
      if (existing) {
        hits.push({
          index,
          duplicate: true,
          reason: `Already logged — ${existing.text} · ₹${existing.amount}`,
        });
        return;
      }

      batch.push({
        id: `batch-${index}`,
        text: item.description,
        amount: item.amount,
        merchant: item.merchant || null,
        date,
        upiRef: item.upiRef ? normalizeUpiRef(item.upiRef) || null : null,
        fingerprint: expenseFingerprint({
          amount: item.amount,
          merchant: item.merchant || item.description,
          text: item.description,
          date,
          upiRef: item.upiRef || null,
        }),
      });
      hits.push({ index, duplicate: false });
    });

    return { hits };
  } catch (error) {
    console.error('checkDumpDuplicates:', error);
    return { error: 'Could not check duplicates' };
  }
}

export async function saveDumpedExpenses(
  items: DumpExpenseInput[]
): Promise<{ saved: number; skipped: number; error?: string }> {
  try {
    const user = await checkUsers();
    if (!user) return { saved: 0, skipped: 0, error: 'Please sign in' };

    const recent = await loadRecentForUser(user.id);
    const inserted: typeof recent = [];
    let saved = 0;
    let skipped = 0;

    for (const item of items) {
      const text = item.description?.trim();
      const date = toUtcNoon(item.date);
      if (!text || !item.category || !date || !item.amount || item.amount <= 0) {
        skipped += 1;
        continue;
      }

      const upiRef = item.upiRef ? normalizeUpiRef(item.upiRef) || null : null;
      const fingerprint = expenseFingerprint({
        amount: item.amount,
        merchant: item.merchant || text,
        text,
        date,
        upiRef,
      });

      if (!item.allowDuplicate) {
        const existing = matchAgainst(item, date, [...recent, ...inserted]);
        if (existing) {
          skipped += 1;
          continue;
        }
      }

      const created = await db.record.create({
        data: {
          text,
          amount: item.amount,
          category: item.category,
          merchant: item.merchant?.trim() || null,
          paymentMethod: item.paymentMethod?.trim() || null,
          note: item.note?.trim() || 'Dumped from screenshot',
          date,
          userId: user.id,
          isCommitted:
            typeof item.isCommitted === 'boolean'
              ? item.isCommitted
              : defaultIsCommitted(item.category, text, item.merchant || ''),
          upiRef,
          fingerprint,
        },
      });

      inserted.push({
        id: created.id,
        text: created.text,
        amount: created.amount,
        merchant: created.merchant,
        date: created.date,
        upiRef: created.upiRef,
        fingerprint: created.fingerprint,
      });
      saved += 1;
    }

    revalidatePath('/');
    return { saved, skipped };
  } catch (error) {
    console.error('saveDumpedExpenses:', error);
    return { saved: 0, skipped: 0, error: 'Could not save dumped expenses' };
  }
}
