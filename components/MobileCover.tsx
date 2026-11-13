import Image from 'next/image';
import { event } from '@/lib/event';

/**
 * Só no telemóvel: ao abrir o link, o primeiro ecrã é a capa do evento, com animação.
 * As informações aparecem depois, ao deslizar para baixo.
 */
export default function MobileCover() {
  return (
    <section
      id="capa"
      aria-label="Capa do evento"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-paper px-6 pb-6 pt-20 md:hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-16 h-72 w-72 animate-pulse rounded-full bg-gold/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-24 h-64 w-64 rounded-full bg-brand/20 blur-3xl"
      />

      <div className="relative animate-cover">
        <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-brand" />
        <Image
          src={event.images.cover.src}
          alt={event.images.cover.alt}
          width={event.images.cover.width}
          height={event.images.cover.height}
          priority
          sizes="90vw"
          className="relative h-auto max-h-[66svh] w-auto max-w-full rounded-3xl border border-ink/10 shadow-2xl"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          <span className="absolute inset-y-0 left-0 w-1/3 animate-[shine_1.8s_ease-out_1s_1_both] bg-white/40 blur-sm" />
        </div>
      </div>

      <a
        href="#inicio"
        className="mt-8 flex animate-fade-up flex-col items-center gap-1 text-sm font-semibold text-ink/70 [animation-delay:1.2s]"
      >
        Desliza para ver os detalhes
        <span aria-hidden className="animate-bounce text-xl text-brand">
          ↓
        </span>
      </a>
    </section>
  );
}
