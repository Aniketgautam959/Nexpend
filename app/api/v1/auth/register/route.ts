import { authPayload, json, optionsResponse, readJson } from '@/lib/api';
import { registerAccount } from '@/lib/auth-service';

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJson<{
    name?: string;
    email?: string;
    password?: string;
  }>(request);

  if (!body) {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const result = await registerAccount(body);
  if (!result.ok) {
    const status = result.error === 'Email already registered' ? 409 : 400;
    return json({ ok: false, error: result.error }, status);
  }

  return json(authPayload(result.user, result.token), 201);
}
