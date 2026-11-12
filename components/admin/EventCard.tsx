'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { event, eventCountdown } from '@/lib/event';

type Countdown = ReturnType<typeof eventCountdown>;

/** Dados do evento (da capa) e contagem decrescente para o painel. */
export default function EventCard() {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    setCountdown(eventCountdown());
    const t = setInterval(() => setCountdown(eventCountdown()), 60_000);
    return () => clearInterval(t);
  }, []);

  const countdownLabel =
    countdown === null
      ? ''
      : countdown.state === 'upcoming'
        ? countdown.days === 1
          ? 'Falta 1 dia'
          : `Faltam ${countdown.days} dias`
        : countdown.state === 'today'
          ? 'O evento é hoje'
          : 'Evento concluído';

  const rows = [
    { label: 'Data', value: `${event.weekday}, ${event.dateLabel}` },
    { label: 'Hora', value: event.timeLabel },
    { label: 'Local', value: `${event.venue} – ${event.city}, ${event.country}` },
    { label: 'Entrada', value: 'Gratuita' },
    {
      label: 'Oradores',
      value: event.speakers.map((s) => (s.tag ? `${s.name} (${s.tag})` : s.name)).join(' · '),
    },
    { label: 'Apoio', value: event.support },
  ];

  return (
    <section
      aria-label="Evento"
      className="grid gap-6 rounded-2xl border border-ink/10 bg-white p-5 sm:grid-cols-[110px_1fr] lg:grid-cols-[110px_1fr_auto]"
    >
      <Image
        src={event.images.cover.src}
        alt={event.images.cover.alt}
        width={event.images.cover.width}
        height={event.images.cover.height}
        sizes="110px"
        className="hidden h-auto w-[110px] rounded-xl border border-ink/10 sm:block"
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Evento</p>
        <h2 className="mt-1 font-display text-xl font-extrabold leading-tight">{event.title}</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink/45">{r.label}</dt>
              <dd className="font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-xl bg-ink p-5 text-white lg:min-w-[190px]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">Contagem</p>
          {countdown === null ? (
            <div className="mt-3 h-8 w-28 animate-pulse rounded bg-white/15" />
          ) : (
            <p className="mt-2 font-display text-2xl font-extrabold">{countdownLabel}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/" className="text-white/70 underline-offset-4 transition hover:text-gold hover:underline">
            Ver landing page
          </Link>
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 underline-offset-4 transition hover:text-gold hover:underline"
          >
            Abrir local no mapa
          </a>
        </div>
      </div>
    </section>
  );
}
