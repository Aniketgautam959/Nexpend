import { json, optionsResponse } from '@/lib/api';
import { clearAuthCookie } from '@/lib/auth';

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function POST(): Promise<Response> {
  try {
    await clearAuthCookie();
  } catch {
    // Mobile clients store the JWT themselves; cookie clear is optional.
  }
  return json({ ok: true });
}
