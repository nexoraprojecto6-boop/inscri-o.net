import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSettings } from '@/lib/settings';
import { checkPanelAuth } from '@/lib/panel-auth';

export const dynamic = 'force-dynamic';

const LIMIT = 5000;

const STATS_SQL = `select
  (select count(*) from participants)::int                                         as total,
  (select count(*) from participants where not has_deriv_account)::int             as without_deriv,
  (select count(*) from participants where has_deriv_account)::int                 as with_deriv,
  (select count(*) from tracking_events where event_type = 'deriv_click')::int     as deriv_clicks,
  (select count(distinct session_id) from tracking_events where event_type = 'deriv_click')::int as deriv_clicks_unique,
  (select count(distinct t.participant_id) from tracking_events t
     join participants p on p.id = t.participant_id
    where t.event_type = 'deriv_click' and not p.has_deriv_account)::int            as no_account_clicked`;

const LIST_SQL = `select p.id, p.full_name, p.email, p.country_code, p.phone, p.has_deriv_account,
  exists (select 1 from tracking_events t where t.participant_id = p.id and t.event_type = 'deriv_click') as clicked_deriv,
  to_char(p.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at
  from participants p order by p.created_at desc, p.id limit ${LIMIT}`;

const NO_STORE = { 'Cache-Control': 'no-store' };

export async function GET(request: Request) {
  const auth = checkPanelAuth(request);
  if (auth === 'limited') return NextResponse.json({ error: 'Demasiados pedidos.' }, { status: 429, headers: NO_STORE });
  if (auth !== 'ok') return NextResponse.json({ error: 'Não autorizado.' }, { status: 401, headers: NO_STORE });

  try {
    const [stats, list, settings] = await Promise.all([query(STATS_SQL), query(LIST_SQL), getSettings()]);
    return NextResponse.json(
      { stats: stats.rows[0], participants: list.rows, settings, limit: LIMIT },
      { headers: NO_STORE },
    );
  } catch (err) {
    console.error('[panel:summary]', err);
    return NextResponse.json({ error: 'Erro ao consultar a base de dados.' }, { status: 500, headers: NO_STORE });
  }
}
