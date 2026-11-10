import { createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function POST(request: Request) {
  if (!rateLimit(`login:${getClientIp(request)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Demasiadas tentativas. Tenta novamente dentro de alguns minutos.' },
      { status: 429 },
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;
  if (!adminEmail || !adminPassword || !secret || secret.length < 16) {
    return NextResponse.json(
      { error: 'Autenticação não configurada (ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET).' },
      { status: 503 },
    );
  }

  let email = '';
  let password = '';
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown };
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Pedido inválido.' }, { status: 400 });
  }

  const okEmail = safeEqual(email, adminEmail);
  const okPassword = safeEqual(password, adminPassword);
  if (!(okEmail && okPassword)) {
    await new Promise((r) => setTimeout(r, 500)); // trava ataques de tentativa e erro
    return NextResponse.json({ error: 'Email ou palavra-passe incorretos.' }, { status: 401 });
  }

  const token = await createSessionToken(adminEmail, secret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
