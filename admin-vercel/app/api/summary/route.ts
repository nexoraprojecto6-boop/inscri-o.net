import { NextResponse } from 'next/server';
import { renderFetch } from '@/lib/render';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  try {
    const res = await renderFetch('/api/panel/summary');
    const data = await res.json().catch(() => ({ error: 'Resposta inválida do servidor.' }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Não foi possível contactar o servidor (Render).' }, { status: 502 });
  }
}
