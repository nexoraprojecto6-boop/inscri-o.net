import 'server-only';
import { z } from 'zod';
import { query } from '@/lib/db';
import { event } from '@/lib/event';

export type AppSettings = {
  whatsappUrl: string;
  derivUrl: string | null;
};

const WHATSAPP_HOSTS = ['chat.whatsapp.com', 'wa.me', 'api.whatsapp.com', 'whatsapp.com', 'www.whatsapp.com'];

const emptyToNull = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? null : v);

const httpsUrl = z
  .string()
  .trim()
  .max(500)
  .url()
  .refine((v) => v.startsWith('https://'), 'O link tem de começar por https://');

export const settingsInputSchema = z.object({
  whatsappUrl: z.preprocess(
    emptyToNull,
    httpsUrl.refine((v) => WHATSAPP_HOSTS.includes(new URL(v).hostname), 'Usa um link do WhatsApp (chat.whatsapp.com/…)').nullable().optional(),
  ),
  derivUrl: z.preprocess(emptyToNull, httpsUrl.nullable().optional()),
});

function envDeriv(): string | null {
  const raw = process.env.NEXT_PUBLIC_DERIV_AFFILIATE_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Links em uso: o que o administrador definiu no painel, ou o valor por omissão do código/ambiente. */
export async function getSettings(): Promise<AppSettings> {
  const { rows } = await query<{ key: string; value: string }>(
    `select key, value from settings where key in ('whatsapp_url', 'deriv_url')`,
  );
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    whatsappUrl: map.get('whatsapp_url') || event.whatsappGroupUrl,
    derivUrl: map.get('deriv_url') || envDeriv(),
  };
}

/** Guarda (ou apaga, se vazio/null) os links enviados. Campos ausentes não são alterados. */
export async function saveSettings(input: { whatsappUrl?: string | null; derivUrl?: string | null }) {
  const entries: [string, string | null | undefined][] = [
    ['whatsapp_url', input.whatsappUrl],
    ['deriv_url', input.derivUrl],
  ];
  for (const [key, value] of entries) {
    if (value === undefined) continue;
    if (value === null) {
      await query('delete from settings where key = $1', [key]);
    } else {
      await query(
        `insert into settings (key, value) values ($1, $2)
         on conflict (key) do update set value = excluded.value, updated_at = now()`,
        [key, value],
      );
    }
  }
}
