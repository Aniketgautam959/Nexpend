import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'auth_token';

async function getUserId(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = await getUserId(request);

  const isAuthPage =
    pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isProtected =
    pathname.startsWith('/profile') || pathname.startsWith('/onboarding');

  if (isProtected && !userId) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthPage && userId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/sign-in/:path*',
    '/sign-up/:path*',
    '/onboarding/:path*',
  ],
};
