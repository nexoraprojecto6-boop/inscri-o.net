import 'server-only';

/** Chama o backend na Render, a partir do servidor, com a chave secreta. A chave nunca chega ao browser. */
export async function renderFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = process.env.RENDER_API_URL?.trim().replace(/\/+$/, '');
  const key = process.env.ADMIN_API_KEY?.trim();
  if (!base || !key) throw new Error('Faltam RENDER_API_URL ou ADMIN_API_KEY.');

  return fetch(`${base}${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    cache: 'no-store',
    // A Render gratuita pode demorar ~50 s a acordar.
    signal: AbortSignal.timeout(55_000),
  });
}
