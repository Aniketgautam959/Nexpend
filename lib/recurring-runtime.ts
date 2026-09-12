import { db } from '@/lib/db';
import { expenseFingerprint } from '@/lib/upiDedupe';

/**
 * Auto-log any due recurring expenses.
 * Catches up missed months (max 6) so inactive periods don't flood.
 */
export async function processDueRecurringForUser(userId: string): Promise<{
  logged: number;
}> {
  const now = new Date();
  const due = await db.recurringExpense.findMany({
    where: {
      userId,
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
          userId,
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

    while (next.getTime() <= now.getTime()) {
      next = advanceOneMonth(next, item.dayOfMonth);
    }

    await db.recurringExpense.update({
      where: { id: item.id },
      data: { nextRunAt: next },
    });
  }

  return { logged };
}

function clampDay(day: number) {
  return Math.min(28, Math.max(1, Math.floor(day)));
}

function advanceOneMonth(date: Date, dayOfMonth: number): Date {
  const day = clampDay(dayOfMonth);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, day, 12, 0, 0)
  );
}
