'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminData } from '@/lib/types';
import Logo from '@/components/Logo';
import EventCard from './EventCard';
import StatisticsCards from './StatisticsCards';
import ParticipantsTable from './ParticipantsTable';

export default function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const requestId = useRef(0);

  const load = useCallback(
    async (q: string) => {
      const id = ++requestId.current;
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/admin/data?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        if (!res.ok) throw new Error('falha');
        const json = (await res.json()) as AdminData;
        if (id === requestId.current) {
          setData(json);
          setUpdatedAt(new Date());
        }
      } catch {
        if (id === requestId.current) setError('Não foi possível carregar os dados. Tenta atualizar.');
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [router],
  );

  // Carrega ao abrir e quando a pesquisa muda (com pequena espera ao escrever).
  useEffect(() => {
    const t = setTimeout(() => void load(query), query ? 300 : 0);
    return () => clearTimeout(t);
  }, [query, load]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    router.replace('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/10 bg-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-gold">Admin</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {email && <span className="hidden text-sm text-ink/55 sm:inline">{email}</span>}
            <button type="button" onClick={logout} className="btn-ghost !px-5 !py-2.5">
              Terminar sessão
            </button>
          </div>
        </div>
      </header>

      <main className="container-x space-y-8 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold">Painel administrativo</h1>
            <p className="mt-1 text-sm text-ink/55" aria-live="polite">
              {loading
                ? 'A carregar dados…'
                : updatedAt
                  ? `Atualizado às ${updatedAt.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`
                  : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => void load(query)}
              disabled={loading}
              className="btn-ghost !px-5 !py-2.5"
            >
              Atualizar
            </button>
            <a href="/api/admin/export" className="btn-dark !px-5 !py-2.5">
              Exportar CSV
            </a>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand">
            {error}
          </p>
        )}

        <EventCard />

        <StatisticsCards stats={data?.stats ?? null} />

        <section aria-label="Participantes" className="space-y-4">
          <div>
            <label htmlFor="search" className="sr-only">
              Pesquisar por nome, email ou telefone
            </label>
            <input
              id="search"
              type="search"
              className="field max-w-md"
              placeholder="Pesquisar por nome, email ou telefone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <ParticipantsTable
            participants={data?.participants ?? []}
            matching={data?.matching ?? 0}
            limit={data?.limit ?? 0}
            loading={loading}
            searching={query.trim() !== ''}
          />
        </section>
      </main>
    </div>
  );
}
