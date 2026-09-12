import { json, optionsResponse, requireApiUser } from '@/lib/api';
import { processDueRecurringForUser } from '@/lib/recurring-runtime';
import { getDashboardData } from '@/lib/dashboard';
import { serializeRecord } from '@/lib/expense-service';
import { toPublicUser } from '@/lib/auth-service';

export function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const recurring = await processDueRecurringForUser(user.id);
  const dashboard = await getDashboardData(user.id, {
    monthlyIncome: user.monthlyIncome,
    savingsGoal: user.savingsGoal,
  });

  return json({
    ok: true,
    user: toPublicUser(user),
    recurringLogged: recurring.logged,
    records: dashboard.records.map(serializeRecord),
    totalSpent: dashboard.totalSpent,
    daysWithRecords: dashboard.daysWithRecords,
    bestExpense: dashboard.bestExpense ?? null,
    worstExpense: dashboard.worstExpense ?? null,
    monthly: dashboard.monthly,
    play: dashboard.play,
  });
}
