import {
  getApiUser,
  json,
  optionsResponse,
  readJson,
  unauthorized,
} from '@/lib/api';
import { findSessionUser, saveOnboarding, toPublicUser } from '@/lib/auth-service';

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function POST(request: Request): Promise<Response> {
  const user = await getApiUser(request);
  if (!user) return unauthorized();

  const body = await readJson<{
    monthlyIncome?: string | number;
    savingsGoal?: string | number;
  }>(request);

  if (!body) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const result = await saveOnboarding(user.id, body);
  if (!result.ok) {
    return json({ ok: false, error: result.error }, 400);
  }

  const updated = await findSessionUser(user.id);
  return json({
    ok: true,
    user: updated ? toPublicUser(updated) : toPublicUser(user),
  });
}
