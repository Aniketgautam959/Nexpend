import { authPayload, json, optionsResponse } from '@/lib/api';
import { loginDemoAccount } from '@/lib/auth-service';

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function POST(): Promise<Response> {
  const result = await loginDemoAccount();
  if (!result.ok) {
    return json({ ok: false, error: result.error }, 500);
  }
  return json(authPayload(result.user, result.token));
}
