'use client';

import { createBrowserClient } from '@supabase/ssr';

/** Cliente de navegador (chave anon). Só é usado para o início de sessão do administrador. */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase não está configurado (ver .env.example).');
  }
  return createBrowserClient(url, anonKey);
}
