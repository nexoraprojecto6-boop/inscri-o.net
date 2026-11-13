'use client';

import { useState } from 'react';
import Image from 'next/image';
import { event } from '@/lib/event';
import { downloadTicketPng } from '@/lib/ticket-image';
import Logo from './Logo';

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

/** Cartão do ingresso (usado na página de inscrição e em /ingresso/[id]). */
export function TicketCard({ name, code }: { name: string; code: string }) {
  return (
    <div
      id="ticket"
      className="relative animate-zoom-in overflow-hidden rounded-[28px] bg-ink text-left text-white shadow-[0_40px_90px_-30px_rgba(17,17,17,.6)]"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-dark px-6 pb-12 pt-6">
        <div aria-hidden className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-gold/40 blur-2xl" />
        <div className="relative pr-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Ingresso</p>
          <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight">{event.title}</h3>
          <p className="mt-2 text-sm text-white/80">Ingresso emitido por Inscri-Ticket</p>
        </div>
        <div className="absolute right-4 top-4 w-24 rotate-3 overflow-hidden rounded-xl border-2 border-white shadow-xl">
          <Image
            src={event.images.cover.src}
            alt={event.images.cover.alt}
            width={event.images.cover.width}
            height={event.images.cover.height}
            sizes="96px"
            className="h-auto w-full"
          />
        </div>
      </div>

      <div className="px-6 pb-6 pt-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Participante</p>
        <p className="mt-1 break-words font-display text-3xl font-extrabold leading-tight">{name}</p>

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

      <div className="relative">
        <span aria-hidden className="ticket-cut absolute -left-4 -top-4 h-8 w-8 rounded-full bg-white" />
        <span aria-hidden className="ticket-cut absolute -right-4 -top-4 h-8 w-8 rounded-full bg-white" />
        <div className="mx-6 border-t-2 border-dashed border-white/25" />
      </div>

      <div className="px-6 pb-7 pt-5">
        <Barcode code={code} />
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="font-mono tracking-[0.25em] text-white/70">Nº {code}</span>
          <span className="rounded-full bg-gold px-3 py-1 font-semibold text-ink">{event.entry}</span>
        </div>
        <div className="mt-5 flex justify-center opacity-90">
          <Logo light />
        </div>
      </div>
    </div>
  );
}

/**
 * Botão "Entrar no grupo do WhatsApp": ao clicar, descarrega o ingresso em PNG
 * automaticamente e, logo a seguir, abre o grupo de WhatsApp.
 */
export function JoinWhatsAppButton({ name, code, className = '' }: { name: string; code: string; className?: string }) {
  const [busy, setBusy] = useState(false);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    try {
      await downloadTicketPng(name, code);
    } catch {
      // Se a imagem falhar, o utilizador entra no grupo na mesma.
    }
    // Pequena pausa para o telemóvel iniciar o download antes de abrir o WhatsApp.
    setTimeout(() => {
      window.location.href = event.whatsappGroupUrl;
      setBusy(false);
    }, 900);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 font-semibold text-white shadow-lg transition hover:brightness-95 disabled:opacity-80 ${className}`}
    >
      {busy ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          A guardar o ingresso…
        </>
      ) : (
        'Entrar no grupo do WhatsApp'
      )}
    </button>
  );
}
