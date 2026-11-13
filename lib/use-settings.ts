'use client';

import { useEffect, useState } from 'react';
import { event } from './event';

let cached: Promise<string> | null = null;

function loadWhatsappUrl(): Promise<string> {
  if (!cached) {
    cached = fetch('/api/settings', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('settings'))))
      .then((d: { whatsappUrl?: string }) => d.whatsappUrl || event.whatsappGroupUrl)
      .catch(() => {
        cached = null;
        return event.whatsappGroupUrl;
      });
  }
  return cached;
}

/** Link do grupo de WhatsApp definido no painel de administração. */
export function useWhatsappUrl(): string {
  const [url, setUrl] = useState<string>(event.whatsappGroupUrl);
  useEffect(() => {
    let alive = true;
    loadWhatsappUrl().then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, []);
  return url;
}
