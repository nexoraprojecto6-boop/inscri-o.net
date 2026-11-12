import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { query } from '@/lib/db';
import type { Participant, Stats } from '@/lib/types';

export const dynamic = 'force-dynamic';

const LIMIT = 500;

const PARTICIPANT_COLUMNS = `id, full_name, email, country_code, phone, has_deriv_account,
  sms_consent, whatsapp_consent,
  to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at`;

const STATS_SQL = `select
  (select count(*) from participants)::int                                            as total_participants,
  (select count(*) from participants where phone <> '')::int                          as total_phones,
  (select count(*) from participants where has_deriv_account)::int                    as with_deriv_account,
  (select count(*) from participants where not has_deriv_account)::int                as without_deriv_account,
  (select count(*) from tracking_events where event_type = 'deriv_click')::int        as total_clicks,
  (select count(distinct session_id) from tracking_events where event_type = 'deriv_click')::int as unique_clicks,
  (select count(*) from participants
     where created_at >= (date_trunc('day', now() at time zone 'Africa/Luanda') at time zone 'Africa/Luanda'))::int as registrations_today,
  (select count(*) from participants where created_at >= now() - interval '7 days')::int as registrations_7d`;

// Escapa % _ \ para a pesquisa ilike tratar o texto literalmente.
const escapeLike = (s: string) => s.replace(/[\\%_]/g, '\\$&');

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim().slice(0, 80);

  const params: unknown[] = [];
  let where = '';
  if (q) {
    params.push(`%${escapeLike(q)}%`);
    const conditions = ['full_name ilike $1', 'email ilike $1'];
    const digits = q.replace(/\D/g, '');
    if (digits.length >= 3) {
      params.push(`%${digits}%`);
      conditions.push('phone ilike $2');
    }
    where = `where ${conditions.join(' or ')}`;
  }

  try {
    const [list, count, stats] = await Promise.all([
      query<Participant>(
        `select ${PARTICIPANT_COLUMNS} from participants ${where}
         order by created_at desc, id limit ${LIMIT}`,
        params,
      ),
      query<{ n: number }>(`select count(*)::int as n from participants ${where}`, params),
      query<Stats>(STATS_SQL),
    ]);

    return NextResponse.json(
      {
        stats: stats.rows[0],
        participants: list.rows,
        matching: count.rows[0]?.n ?? 0,
        limit: LIMIT,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[admin:data]', err);
    return NextResponse.json({ error: 'Erro ao consultar a base de dados.' }, { status: 500 });
  }
}
