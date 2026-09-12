import { db } from '@/lib/db';
import {
  json,
  optionsResponse,
  readJson,
  requireApiUser,
} from '@/lib/api';
import { defaultIsCommitted } from '@/lib/playMoney';

function clampDay(day: number) {
  return Math.min(28, Math.max(1, Math.floor(day)));
}

function computeNextRunAt(dayOfMonth: number, from = new Date()): Date {
  const day = clampDay(dayOfMonth);
  const y = from.getUTCFullYear();
  const m = from.getUTCMonth();
  const candidate = new Date(Date.UTC(y, m, day, 12, 0, 0));
  if (candidate.getTime() > from.getTime()) return candidate;
  return new Date(Date.UTC(y, m + 1, day, 12, 0, 0));
}

function serializeRecurring(row: {
  id: string;
  text: string;
  amount: number;
  category: string;
  merchant: string | null;
  paymentMethod: string | null;
  note: string | null;
  dayOfMonth: number;
  nextRunAt: Date;
  isActive: boolean;
  isCommitted: boolean;
}) {
  return {
    id: row.id,
    text: row.text,
    amount: row.amount,
    category: row.category,
    merchant: row.merchant,
    paymentMethod: row.paymentMethod,
    note: row.note,
    dayOfMonth: row.dayOfMonth,
    nextRunAt: row.nextRunAt.toISOString(),
    isActive: row.isActive,
    isCommitted: row.isCommitted,
  };
}

export function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const rows = await db.recurringExpense.findMany({
    where: { userId: user.id },
    orderBy: [{ isActive: 'desc' }, { dayOfMonth: 'asc' }],
  });

  return json({ ok: true, items: rows.map(serializeRecurring) });
}

export async function POST(request: Request) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const body = await readJson<{
    text?: string;
    amount?: number;
    category?: string;
    merchant?: string;
    paymentMethod?: string;
    note?: string;
    dayOfMonth?: number;
    isCommitted?: boolean;
  }>(request);

  if (!body) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const text = String(body.text || '').trim();
  if (!text) return json({ ok: false, error: 'Name is required' }, 400);
  if (!body.amount || body.amount <= 0) {
    return json({ ok: false, error: 'Enter a valid amount' }, 400);
  }

  const dayOfMonth = clampDay(body.dayOfMonth || 1);
  const category = body.category || 'Subscriptions';
  const created = await db.recurringExpense.create({
    data: {
      text,
      amount: body.amount,
      category,
      merchant: body.merchant?.trim() || null,
      paymentMethod: body.paymentMethod?.trim() || null,
      note: body.note?.trim() || 'Recurring',
      dayOfMonth,
      nextRunAt: computeNextRunAt(dayOfMonth),
      isCommitted:
        typeof body.isCommitted === 'boolean'
          ? body.isCommitted
          : defaultIsCommitted(category, text),
      userId: user.id,
    },
  });

  return json({ ok: true, item: serializeRecurring(created) }, 201);
}
