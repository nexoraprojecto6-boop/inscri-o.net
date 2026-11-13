import 'server-only';
import { timingSafeEqual } from 'node:crypto';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

/**
 * Autenticação das rotas /api/panel/* (usadas só pelo painel separado na Vercel).
 * O painel envia o cabeçalho  Authorization: Bearer <ADMIN_API_KEY>  a partir do servidor dele.
 */
export function checkPanelAuth(request: Request): 'ok' | 'unauthorized' | 'limited' {
  if (!rateLimit(`panel:${getClientIp(request)}`, 60, 60 * 1000)) return 'limited';

  const key = process.env.ADMIN_API_KEY?.trim();
  if (!key || key.length < 24) return 'unauthorized';

  const match = /^Bearer (.+)$/.exec(request.headers.get('authorization') ?? '');
  if (!match) return 'unauthorized';

  const a = Buffer.from(match[1]);
  const b = Buffer.from(key);
  if (a.length !== b.length) return 'unauthorized';
  return timingSafeEqual(a, b) ? 'ok' : 'unauthorized';
}
