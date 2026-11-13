import { NextResponse } from 'next/server';
import { getSettings, saveSettings, settingsInputSchema } from '@/lib/settings';
import { checkPanelAuth } from '@/lib/panel-auth';

export const dynamic = 'force-dynamic';

const NO_STORE = { 'Cache-Control': 'no-store' };

/** Guarda o link do grupo de WhatsApp e/ou o link de afiliado Deriv. Campo vazio = voltar ao valor por omissão. */
export async function PUT(request: Request) {
  const auth = checkPanelAuth(request);
  if (auth === 'limited') return NextResponse.json({ error: 'Demasiados pedidos.' }, { status: 429, headers: NO_STORE });
  if (auth !== 'ok') return NextResponse.json({ error: 'Não autorizado.' }, { status: 401, headers: NO_STORE });

  const body = await request.json().catch(() => null);
  const parsed = settingsInputSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Dados inválidos.';
    return NextResponse.json({ error: message }, { status: 400, headers: NO_STORE });
  }

  try {
    await saveSettings(parsed.data);
    return NextResponse.json({ ok: true, settings: await getSettings() }, { headers: NO_STORE });
  } catch (err) {
    console.error('[panel:settings]', err);
    return NextResponse.json({ error: 'Não foi possível guardar.' }, { status: 500, headers: NO_STORE });
  }
}
