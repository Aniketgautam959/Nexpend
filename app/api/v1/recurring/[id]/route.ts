import { db } from '@/lib/db';
import {
  json,
  optionsResponse,
  readJson,
  requireApiUser,
} from '@/lib/api';

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

export function OPTIONS() {
  return optionsResponse();
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const { id } = await context.params;
  const body = await readJson<{
    toggle?: boolean;
    isActive?: boolean;
    isCommitted?: boolean;
  }>(request);

  if (!body) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const row = await db.recurringExpense.findFirst({
    where: { id, userId: user.id },
  });
  if (!row) {
    return json({ ok: false, error: 'Not found' }, 404);
  }

  const data: {
    isActive?: boolean;
    isCommitted?: boolean;
    nextRunAt?: Date;
  } = {};

  if (body.toggle === true || typeof body.isActive === 'boolean') {
    const isActive =
      typeof body.isActive === 'boolean' ? body.isActive : !row.isActive;
    data.isActive = isActive;
    if (isActive) {
      data.nextRunAt = computeNextRunAt(row.dayOfMonth);
    }
  }

  if (typeof body.isCommitted === 'boolean') {
    data.isCommitted = body.isCommitted;
  }

  if (Object.keys(data).length === 0) {
    return json({ ok: false, error: 'Nothing to update' }, 400);
  }

  const updated = await db.recurringExpense.update({
    where: { id },
    data,
  });

  return json({
    ok: true,
    item: {
      id: updated.id,
      text: updated.text,
      amount: updated.amount,
      category: updated.category,
      merchant: updated.merchant,
      paymentMethod: updated.paymentMethod,
      note: updated.note,
      dayOfMonth: updated.dayOfMonth,
      nextRunAt: updated.nextRunAt.toISOString(),
      isActive: updated.isActive,
      isCommitted: updated.isCommitted,
    },
  });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const { id } = await context.params;
  const result = await db.recurringExpense.deleteMany({
    where: { id, userId: user.id },
  });

  if (result.count === 0) {
    return json({ ok: false, error: 'Not found' }, 404);
  }

  return json({ ok: true });
}
