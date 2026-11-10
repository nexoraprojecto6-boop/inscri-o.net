import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session';

/**
 * Devolve o administrador autenticado (cookie assinado válido e email igual a ADMIN_EMAIL),
 * ou null. Usado nas páginas e rotas /admin e /api/admin.
 */
export async function getAdminUser(): Promise<{ email: string } | null> {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value, process.env.AUTH_SECRET);
  if (!session) return null;

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail || session.email !== adminEmail) return null;
  return session;
}
