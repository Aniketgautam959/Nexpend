import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  getCurrentUser,
  SESSION_USER_SELECT,
  verifyToken,
  type SessionUser,
} from '@/lib/auth';
import { TOKEN_TTL_SECONDS, toPublicUser } from '@/lib/auth-service';
import { CORS_HEADERS } from '@/lib/cors';

export { CORS_HEADERS };

export function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export function optionsResponse() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function readJson<T = Record<string, unknown>>(
  request: Request
): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function authPayload(user: SessionUser, token: string) {
  return {
    ok: true as const,
    token,
    tokenType: 'Bearer',
    expiresIn: TOKEN_TTL_SECONDS,
    user: toPublicUser(user),
  };
}

export async function getApiUser(
  request: Request
): Promise<SessionUser | null> {
  const header =
    request.headers.get('authorization') ||
    request.headers.get('Authorization');

  if (header && /^bearer\s+/i.test(header)) {
    const token = header.replace(/^bearer\s+/i, '').trim();
    if (!token) return null;
    const userId = await verifyToken(token);
    if (!userId) return null;
    return db.user.findUnique({
      where: { id: userId },
      select: SESSION_USER_SELECT,
    });
  }

  return getCurrentUser();
}

export function unauthorized() {
  return json({ ok: false, error: 'Please sign in' }, 401);
}
