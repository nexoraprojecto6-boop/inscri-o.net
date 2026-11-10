import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { query } from '@/lib/db';
import type { Participant } from '@/lib/types';

export const dynamic = 'force-dynamic';

const COLUMNS = `id, full_name, email, country_code, phone, has_deriv_account,
  sms_consent, whatsapp_consent,
  to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as created_at`;

// Evita injeção de fórmulas ao abrir o CSV em Excel/Sheets.
// Só campos escritos pelo utilizador (nome, email) são neutralizados;
// o indicativo (+244) e os restantes são gerados/validados pelo sistema.
function csvCell(value: string | null | undefined, userInput = false): string {
  let text = value ?? '';
  if (userInput && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });

  try {
    const rows: Participant[] = [];
    const pageSize = 1000;

    for (let offset = 0; ; offset += pageSize) {
      const { rows: batch } = await query<Participant>(
        `select ${COLUMNS} from participants order by created_at desc, id limit ${pageSize} offset $1`,
        [offset],
      );
      rows.push(...batch);
      if (batch.length < pageSize) break;
    }

    const header = [
      'Nome completo',
      'Email',
      'Indicativo',
      'Telefone',
      'Conta Deriv (declarada)',
      'Consentimento SMS',
      'Consentimento WhatsApp',
      'Data de inscrição',
    ];
    const lines = rows.map((p) =>
      [
        csvCell(p.full_name, true),
        csvCell(p.email, true),
        csvCell(p.country_code),
        csvCell(p.phone),
        csvCell(p.has_deriv_account ? 'Sim' : 'Não'),
        csvCell(p.sms_consent ? 'Sim' : 'Não'),
        csvCell(p.whatsapp_consent ? 'Sim' : 'Não'),
        csvCell(p.created_at),
      ].join(','),
    );

    const csv = '﻿' + [header.map((h) => csvCell(h)).join(','), ...lines].join('\r\n');
    const day = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="participantes-${day}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('[admin:export]', err);
    return NextResponse.json({ error: 'Erro ao exportar os contactos.' }, { status: 500 });
  }
}
