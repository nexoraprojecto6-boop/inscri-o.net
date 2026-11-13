import Image from 'next/image';
import { content } from '@/lib/content';
import { event } from '@/lib/event';

export default function Hero() {
  const { hero } = content;
  const chips = [event.dateShort, event.timeLabel, `${event.venue} · ${event.city}`, event.entry];

  return (
    <section id="inicio" className="relative overflow-hidden bg-paper pb-16 pt-12 sm:pb-24 sm:pt-36">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-gold/60 blur-3xl sm:h-[560px] sm:w-[560px]"
      />

      <div className="container-x relative grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow animate-fade-up">{hero.eyebrow}</p>

          {/* Título = nome do workshop, igual ao do cartaz */}
          <h1 className="mt-5 max-w-3xl animate-fade-up font-display text-[2.2rem] font-extrabold leading-[1.05] tracking-tight [animation-delay:.08s] sm:text-5xl lg:text-6xl">
            {event.title}
          </h1>

          <ul className="stagger mt-6 flex flex-wrap gap-2 text-sm font-semibold">
            {chips.map((c) => (
              <li key={c} className="rounded-full border border-ink/15 bg-white px-4 py-1.5">
                {c}
              </li>
            ))}
          </ul>

          {/* Foto do local (telemóvel) */}
          <div className="reveal reveal-zoom mt-8 overflow-hidden rounded-2xl border border-ink/10 shadow-xl md:hidden">
            <Image
              src={event.images.hotel.src}
              alt={event.images.hotel.alt}
              width={event.images.hotel.width}
              height={event.images.hotel.height}
              sizes="90vw"
              className="h-auto w-full"
            />
          </div>

          <a href="#inscricao" className="btn-primary relative mt-8 w-full overflow-hidden sm:w-auto">
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1/4 animate-shine bg-white/30 blur-[2px]"
            />
            <span className="relative">{hero.cta}</span>
            <span aria-hidden className="relative">→</span>
          </a>
        </div>

        {/* Cartaz + foto do local (computador) */}
        <div className="relative mx-auto mb-10 hidden w-full max-w-sm animate-cover [animation-delay:.1s] md:block md:max-w-none">
          <div data-parallax="0.07" className="relative will-change-transform">
            <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-brand" />
            <Image
              src={event.images.cover.src}
              alt={event.images.cover.alt}
              width={event.images.cover.width}
              height={event.images.cover.height}
              priority
              sizes="40vw"
              className="relative h-auto w-full rounded-3xl border border-ink/10 shadow-2xl"
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <span className="absolute inset-y-0 left-0 w-1/3 animate-[shine_1.8s_ease-out_1s_1_both] bg-white/40 blur-sm" />
            </div>
            <div className="absolute -bottom-10 -left-12 z-10 w-56 animate-float">
              <div className="overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                <Image
                  src={event.images.hotel.src}
                  alt={event.images.hotel.alt}
                  width={event.images.hotel.width}
                  height={event.images.hotel.height}
                  sizes="224px"
                  className="h-auto w-full"
                />
              </div>
              <span className="absolute -bottom-3 left-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white shadow-lg">
                📍 {event.venue} · {event.city}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
