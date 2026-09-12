import {
  json,
  optionsResponse,
  readJson,
  requireApiUser,
} from '@/lib/api';
import {
  findSessionUser,
  toPublicUser,
  updateAccountProfile,
} from '@/lib/auth-service';

export function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: Request) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;
  return json({ ok: true, user: toPublicUser(user) });
}

export async function PATCH(request: Request) {
  const { user, response } = await requireApiUser(request);
  if (!user) return response;

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
