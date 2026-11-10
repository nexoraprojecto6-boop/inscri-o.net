'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * "Já somos X participantes inscritos!"
 * O valor vem da base de dados (GET /api/registrations) e é atualizado
 * automaticamente após uma nova inscrição. Mostra apenas um número.
 */
export default function ParticipantCounter({ variant = 'hero' }: { variant?: 'hero' | 'section' }) {
  const [count, setCount] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/registrations', { cache: 'no-store' });
      if (!res.ok) throw new Error('falha');
      const data = (await res.json()) as { count: number };
      setCount(data.count);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener('registration:created', load);
    return () => window.removeEventListener('registration:created', load);
  }, [load]);

  // Sem dados reais, não mostramos números inventados.
  if (failed && count === null) return null;

  const dark = variant === 'section';

  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full px-5 py-3 ${
        dark ? 'bg-white/10 text-white' : 'border border-ink/10 bg-white text-ink shadow-sm'
      }`}
      aria-live="polite"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
      </span>
      <span className="text-sm font-medium sm:text-base">
        {count === null ? (
          <span className="inline-block h-4 w-48 animate-pulse rounded bg-gold/40 align-middle" />
        ) : (
          <>
            Já somos <strong className="font-display text-lg font-extrabold">{count}</strong>{' '}
            {count === 1 ? 'participante inscrito' : 'participantes inscritos'}!
          </>
        )}
      </span>
    </div>
  );
}
