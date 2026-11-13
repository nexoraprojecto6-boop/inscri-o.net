import { NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, safeCompare } from '@/lib/session';

export const dynamic = 'force-dynamic';

const attempts = new Map<string, { n: number; reset: number }>();

export async function POST(request: Request) {
  const ip = (request.headers.get('x-forwarded-for') ?? 'x').split(',')[0].trim();
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.reset > now && a.n >= 8) {
    return NextResponse.json({ error: 'Demasiadas tentativas. Espera uns minutos.' }, { status: 429 });
  }
  attempts.set(ip, a && a.reset > now ? { n: a.n + 1, reset: a.reset } : { n: 1, reset: now + 10 * 60 * 1000 });

  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;
  if (!expected || !secret || secret.length < 32) {
    return NextResponse.json({ error: 'Painel sem configuração (ADMIN_PASSWORD / AUTH_SECRET).' }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!safeCompare(password, expected)) {
    return NextResponse.json({ error: 'Palavra-passe incorreta.' }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
