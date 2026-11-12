import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Dados do ingresso. O identificador da inscrição (UUID impossível de adivinhar)
 * funciona como código secreto do ingresso. Só devolve o nome e o número: nunca
 * email nem telefone.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIp(request);
  if (!rateLimit(`ticket:${ip}`, 40, 60 * 1000)) {
    return NextResponse.json({ error: 'Demasiados pedidos.' }, { status: 429, headers: NO_STORE });
  }

  const { id } = await params;
  if (!UUID.test(id)) {
    return NextResponse.json({ error: 'Ingresso não encontrado.' }, { status: 404, headers: NO_STORE });
  }

  try {
    const { rows } = await query<{ full_name: string; created_at: string }>(
      'select full_name, created_at from participants where id = $1',
      [id],
    );
    if (!rows[0]) {
      return NextResponse.json({ error: 'Ingresso não encontrado.' }, { status: 404, headers: NO_STORE });
    }
    return NextResponse.json(
      {
        name: rows[0].full_name,
        code: id.slice(0, 8).toUpperCase(),
        createdAt: rows[0].created_at,
      },
      { headers: NO_STORE },
    );
  } catch (err) {
    console.error('[ticket:GET]', err);
    return NextResponse.json({ error: 'Não foi possível obter o ingresso.' }, { status: 500, headers: NO_STORE });
  }
}
