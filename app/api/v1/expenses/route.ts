import {
  getApiUser,
  json,
  optionsResponse,
  readJson,
  unauthorized,
} from '@/lib/api';
import {
  createExpense,
  listExpenses,
  type ExpenseInput,
} from '@/lib/expense-service';

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function GET(request: Request): Promise<Response> {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const url = new URL(request.url);
  const take = Number(url.searchParams.get('limit') || 200);
  const records = await listExpenses(
    user.id,
    Number.isFinite(take) ? Math.min(Math.max(take, 1), 500) : 200
  );

  return json({ ok: true, records });
}

export async function POST(request: Request): Promise<Response> {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const body = await readJson<ExpenseInput>(request);
  if (!body) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const result = await createExpense(user.id, body);
  if (!result.ok) {
    return json({ ok: false, error: result.error }, 400);
  }

  return json({ ok: true, record: result.record }, 201);
}
