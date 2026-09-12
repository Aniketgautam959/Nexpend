import {
  json,
  optionsResponse,
  readJson,
  requireApiUser,
} from '@/lib/api';
import {
  deleteExpense,
  updateExpense,
  type ExpenseInput,
} from '@/lib/expense-service';

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
  const body = await readJson<ExpenseInput>(request);
  if (!body) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const result = await updateExpense(user.id, id, body);
  if (!result.ok) {
    const status = result.error === 'Expense not found' ? 404 : 400;
    return json({ ok: false, error: result.error }, status);
  }

  return json({ ok: true, record: result.record });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

  const { id } = await context.params;
  const result = await deleteExpense(user.id, id);
  if (!result.ok) {
    return json({ ok: false, error: result.error }, 404);
  }

  return json({ ok: true, message: result.message });
}
