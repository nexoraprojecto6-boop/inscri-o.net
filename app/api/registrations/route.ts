import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { registrationSchema } from '@/lib/validations';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

/** Contagem pública: apenas um número, nunca dados pessoais. */
export async function GET() {
  try {
    const { rows } = await query<{ count: number }>('select count(*)::int as count from participants');
    return NextResponse.json({ count: rows[0]?.count ?? 0 }, { headers: NO_STORE });
  } catch (err) {
    console.error('[registrations:GET]', err);
    return NextResponse.json({ error: 'Não foi possível obter a contagem.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!rateLimit(`reg:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Demasiados pedidos. Tenta novamente dentro de alguns minutos.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    const raw: unknown = await request.json();
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) throw new Error('inválido');
    body = raw as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Pedido inválido.' }, { status: 400 });
  }

  // Anti-spam 1: campo isco (honeypot) preenchido => bot.
  // Respondemos com "sucesso" para não dar pistas, mas nada é guardado.
  const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
  if (honeypot !== '') {
    return NextResponse.json({ ok: true });
  }

  // Anti-spam 2: formulário preenchido rápido demais. Pedimos para tentar de novo
  // (em vez de descartar em silêncio) para não perder inscrições de pessoas reais.
  const elapsed = typeof body.elapsedMs === 'number' ? body.elapsedMs : Infinity;
  if (elapsed < 1500) {
    return NextResponse.json(
      { error: 'Submissão demasiado rápida. Confirma os dados e tenta novamente.' },
      { status: 400 },
    );
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Dados inválidos.', fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const d = parsed.data;

  try {
    const { rows } = await query<{ id: string }>(
      `insert into participants
         (full_name, email, phone, country_code, has_deriv_account, sms_consent, whatsapp_consent)
       values ($1, $2, $3, $4, $5, $6, $7)
       returning id`,
      [d.fullName, d.email, d.phone, d.countryCode, d.hasDerivAccount, d.smsConsent, d.whatsappConsent],
    );
    return NextResponse.json({ ok: true, id: rows[0].id }, { status: 201 });
  } catch (err) {
    if ((err as { code?: string }).code === '23505') {
      return NextResponse.json(
        { error: 'Este email ou número de telefone já está inscrito.' },
        { status: 409 },
      );
    }
    console.error('[registrations:POST]', err);
    return NextResponse.json(
      { error: 'Não foi possível concluir a inscrição. Tenta novamente.' },
      { status: 500 },
    );
  }
}
