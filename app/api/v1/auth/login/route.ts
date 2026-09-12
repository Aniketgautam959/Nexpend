import { authPayload, json, optionsResponse, readJson } from '@/lib/api';
import { loginAccount } from '@/lib/auth-service';

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJson<{
    email?: string;
    password?: string;
  }>(request);

  if (!body) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const result = await loginAccount(body);
  if (!result.ok) {
    const status =
      result.error === 'Invalid email or password' ? 401 : 400;
    return json({ ok: false, error: result.error }, status);
  }

  return json(authPayload(result.user, result.token));
}
