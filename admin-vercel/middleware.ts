import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

const PUBLIC = ['/login', '/api/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC.includes(pathname)) return NextResponse.next();

  const ok = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, process.env.AUTH_SECRET);
  if (ok) return NextResponse.next();

  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
