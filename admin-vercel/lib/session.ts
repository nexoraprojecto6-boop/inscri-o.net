// Sessão do painel: cookie assinado com HMAC-SHA256 (Web Crypto). Funciona no middleware (Edge) e nas rotas.

export const SESSION_COOKIE = 'inscriticket_admin';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 horas

const enc = new TextEncoder();

const toB64url = (t: string) => btoa(t).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (t: string) => {
  const p = t.replace(/-/g, '+').replace(/_/g, '/');
  return atob(p + '='.repeat((4 - (p.length % 4)) % 4));
};

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(payload)));
  let bin = '';
  sig.forEach((b) => (bin += String.fromCharCode(b)));
  return toB64url(bin);
}

export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = toB64url(String(exp));
  return `${payload}.${await sign(payload, secret)}`;
}

export async function verifySessionToken(token: string | undefined, secret: string | undefined): Promise<boolean> {
  if (!token || !secret || secret.length < 32) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  try {
    if (!safeCompare(signature, await sign(payload, secret))) return false;
    return Number(fromB64url(payload)) >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
