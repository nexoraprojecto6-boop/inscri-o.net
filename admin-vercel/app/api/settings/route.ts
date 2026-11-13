import { NextResponse } from 'next/server';
import { renderFetch } from '@/lib/render';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function PUT(request: Request) {
  const body = await request.text();
  try {
    const res = await renderFetch('/api/panel/settings', { method: 'PUT', body });
    const data = await res.json().catch(() => ({ error: 'Resposta inválida do servidor.' }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Não foi possível contactar o servidor (Render).' }, { status: 502 });
  }
}
