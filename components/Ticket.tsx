'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TicketCard, JoinWhatsAppButton } from './TicketCard';
import Logo from './Logo';

type TicketData = { name: string; code: string; createdAt: string };
type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ok'; data: TicketData };

export default function Ticket({ id }: { id: string }) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/ticket/${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as Partial<TicketData> & { error?: string };
        if (cancelled) return;
        if (!res.ok || !body.name || !body.code) {
          setState({ status: 'error', message: body.error ?? 'Não foi possível obter o ingresso.' });
          return;
        }
        setState({ status: 'ok', data: body as TicketData });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', message: 'Sem ligação ao servidor. Tenta novamente.' });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="no-print mb-6 flex justify-center">
          <Logo />
        </div>

        {state.status === 'loading' && (
          <div className="grid h-96 place-items-center" role="status">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink/20 border-t-brand" />
          </div>
        )}

        {state.status === 'error' && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl" role="alert">
            <p className="font-display text-2xl font-extrabold">Ingresso indisponível</p>
            <p className="mt-3 text-ink/70">{state.message}</p>
            <Link href="/#inscricao" className="btn-primary mt-6">
              Fazer inscrição
            </Link>
          </div>
        )}

        {state.status === 'ok' && (
          <>
            <p className="no-print mb-5 animate-fade-up text-center text-ink/70">
              Inscrição confirmada! Mostra este ingresso no ecrã ou imprime-o.
            </p>
            <TicketCard name={state.data.name} code={state.data.code} />


            <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => window.print()} className="btn-primary flex-1">
                Imprimir ingresso
              </button>
              <JoinWhatsAppButton name={state.data.name} code={state.data.code} className="flex-1" />
            </div>
            <p className="no-print mt-4 text-center text-sm text-ink/55">
              Podes também guardar esta página nos favoritos ou tirar uma captura de ecrã.
            </p>
            <p className="no-print mt-2 text-center text-sm">
              <Link href="/" className="font-semibold text-brand underline-offset-4 hover:underline">
                Voltar ao site
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
