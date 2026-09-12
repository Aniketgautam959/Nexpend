import {
  getApiUser,
  json,
  optionsResponse,
  readJson,
  unauthorized,
} from '@/lib/api';
import {
  findSessionUser,
  toPublicUser,
  updateAccountProfile,
} from '@/lib/auth-service';

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function GET(request: Request): Promise<Response> {
  const user = await getApiUser(request);
  if (!user) return unauthorized();
  return json({ ok: true, user: toPublicUser(user) });
}

export async function PATCH(request: Request): Promise<Response> {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const body = await readJson<{
    name?: string;
    email?: string;
    password?: string;
    monthlyIncome?: string | number;
    savingsGoal?: string | number | null;
  }>(request);

  if (!body) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const result = await updateAccountProfile(user, body);
  if (!result.ok) {
    return json({ ok: false, error: result.error }, 400);
  }

  const updated = await findSessionUser(user.id);
  return json({
    ok: true,
    user: updated ? toPublicUser(updated) : toPublicUser(user),
  });
}
