'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { event } from '@/lib/event';
import WhatsAppFab from './WhatsAppFab';

type TicketData = { name: string; code: string; createdAt: string };
type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ok'; data: TicketData };

/** Código de barras decorativo, gerado a partir do número do ingresso. */
function Barcode({ code }: { code: string }) {
  let x = 0;
  const bars = Array.from(code + code).map((ch, i) => {
    const w = (parseInt(ch, 16) % 4) + 1;
    const rect = <rect key={i} x={x} y={0} width={w} height={40} fill="currentColor" />;
    x += w + 2 + (i % 3);
    return rect;
  });
  return (
    <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className="h-10 w-full text-white/80" aria-hidden>
      {bars}
    </svg>
  );
}

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
    <main className="min-h-screen bg-paper px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <p className="no-print mb-6 text-center font-display text-lg font-bold">
          Projeto Serio<span className="text-brand">$</span>
        </p>

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

            <div
              id="ticket"
              className="relative animate-zoom-in overflow-hidden rounded-[28px] bg-ink text-white shadow-[0_40px_90px_-30px_rgba(17,17,17,.6)]"
            >
              {/* Topo com a cor da marca e a capa do evento no canto */}
              <div className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-dark px-6 pb-12 pt-6">
                <div aria-hidden className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-gold/40 blur-2xl" />
                <div className="relative pr-28">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Ingresso</p>
                  <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight">{event.title}</h1>
                  <p className="mt-2 text-sm text-white/80">Projeto Serio$</p>
                </div>
                <div className="absolute right-4 top-4 w-24 rotate-3 overflow-hidden rounded-xl border-2 border-white shadow-xl">
                  <Image
                    src={event.images.cover.src}
                    alt={event.images.cover.alt}
                    width={event.images.cover.width}
                    height={event.images.cover.height}
                    sizes="96px"
                    priority
                    className="h-auto w-full"
                  />
                </div>
              </div>

              {/* Corpo */}
              <div className="px-6 pb-6 pt-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Participante</p>
                <p className="mt-1 break-words font-display text-3xl font-extrabold leading-tight">
                  {state.data.name}
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5">
                  {[
                    ['Data', event.dateShort],
                    ['Hora', event.timeLabel],
                    ['Local', event.venue],
                    ['Cidade', `${event.city}, ${event.country}`],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{label}</dt>
                      <dd className="mt-0.5 font-display text-lg font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Picote */}
              <div className="relative">
                <span aria-hidden className="ticket-cut absolute -left-4 -top-4 h-8 w-8 rounded-full bg-paper" />
                <span aria-hidden className="ticket-cut absolute -right-4 -top-4 h-8 w-8 rounded-full bg-paper" />
                <div className="mx-6 border-t-2 border-dashed border-white/25" />
              </div>

              <div className="px-6 pb-7 pt-5">
                <Barcode code={state.data.code} />
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="font-mono tracking-[0.25em] text-white/70">Nº {state.data.code}</span>
                  <span className="rounded-full bg-gold px-3 py-1 font-semibold text-ink">{event.entry}</span>
                </div>
              </div>
            </div>

            <div className="no-print mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => window.print()} className="btn-primary flex-1">
                Imprimir ingresso
              </button>
              <a
                href={event.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark flex-1"
              >
                Entrar no grupo do WhatsApp
              </a>
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
      <WhatsAppFab />
    </main>
  );
}
