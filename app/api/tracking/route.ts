import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sessionIdSchema, uuidSchema } from '@/lib/validations';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

function getAffiliateUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_DERIV_AFFILIATE_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

const INSERT_SQL = `insert into tracking_events (event_type, session_id, participant_id, user_agent)
                    values ('deriv_click', $1, $2, $3)`;

/**
 * GET /api/tracking?sid=<sessão>&pid=<participante opcional>
 * Regista o clique no servidor e redireciona para o link de afiliado.
 * Um clique NÃO prova que foi criada uma conta.
 */
export async function GET(request: Request) {
  const affiliateUrl = getAffiliateUrl();
  if (!affiliateUrl) {
    return new NextResponse('O link de afiliado Deriv ainda não foi configurado.', { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const sid = sessionIdSchema.safeParse(searchParams.get('sid'));
  const pidParam = searchParams.get('pid');
  const pid = pidParam ? uuidSchema.safeParse(pidParam) : null;

  const allowed = rateLimit(`trk:${getClientIp(request)}`, 30, 10 * 60 * 1000);

  if (sid.success && allowed) {
    const userAgent = (request.headers.get('user-agent') ?? '').slice(0, 300);
    try {
      try {
        await query(INSERT_SQL, [sid.data, pid?.success ? pid.data : null, userAgent]);
      } catch (err) {
        // 23503 = participante inexistente: regista o clique sem associação.
        if ((err as { code?: string }).code === '23503') {
          await query(INSERT_SQL, [sid.data, null, userAgent]);
        } else {
          throw err;
        }
      }
    } catch (err) {
      // Falhar o registo nunca deve impedir o utilizador de seguir.
      console.error('[tracking]', err);
    }
  }

  return NextResponse.redirect(affiliateUrl, { status: 302 });
}
