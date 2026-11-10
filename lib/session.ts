// Sessão de administrador: cookie assinado com HMAC-SHA256 (Web Crypto).
// Funciona no middleware (Edge) e nas rotas (Node). Sem dependências externas.

export const SESSION_COOKIE = 'serios_admin';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

const enc = new TextEncoder();

function toB64url(text: string): string {
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(text: string): string {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(payload)));
  let bin = '';
  sig.forEach((b) => (bin += String.fromCharCode(b)));
  return toB64url(bin);
}

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(email: string, secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = toB64url(`${exp}:${email}`);
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
): Promise<{ email: string } | null> {
  if (!token || !secret) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  try {
    const expected = await sign(payload, secret);
    if (!safeCompare(signature, expected)) return null;

    const decoded = fromB64url(payload);
    const sep = decoded.indexOf(':');
    const exp = Number(decoded.slice(0, sep));
    const email = decoded.slice(sep + 1);
    if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return null;
    return { email };
  } catch {
    return null;
  }
}
