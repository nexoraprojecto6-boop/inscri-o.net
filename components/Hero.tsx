import Image from 'next/image';
import { content } from '@/lib/content';
import { event } from '@/lib/event';
import ParticipantCounter from './ParticipantCounter';

export default function Hero() {
  const { hero } = content;
  const marquee = [...hero.marquee, ...hero.marquee];
  const chips = [event.dateShort, event.timeLabel, `${event.venue} · ${event.city}`, event.entry];

  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-28 sm:pt-36">
      {/* Formas decorativas */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-gold/60 blur-3xl sm:h-[560px] sm:w-[560px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-brand/15 blur-3xl"
      />

      <div className="container-x relative grid items-center gap-14 pb-24 sm:pb-32 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow animate-fade-up">{hero.eyebrow}</p>

          {/* Título = nome do workshop, igual ao do cartaz */}
          <h1 className="mt-5 max-w-3xl animate-fade-up font-display text-[2.4rem] font-extrabold leading-[1.02] tracking-tight [animation-delay:.08s] sm:text-5xl lg:text-6xl">
            {event.title}
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-ink/70 [animation-delay:.16s]">
            {hero.description}
          </p>

          <ul className="stagger mt-6 flex flex-wrap gap-2 text-sm font-semibold">
            {chips.map((c) => (
              <li key={c} className="rounded-full border border-ink/15 bg-white px-4 py-1.5">
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:.24s] sm:flex-row">
            <a href="#inscricao" className="btn-primary relative overflow-hidden">
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1/4 animate-shine bg-white/30 blur-[2px]"
              />
              <span className="relative">{hero.cta}</span>
              <span aria-hidden className="relative">→</span>
            </a>
            <a href="#evento" className="btn-ghost">
              {hero.secondaryCta}
            </a>
          </div>

          <div className="mt-10 animate-fade-up [animation-delay:.32s]">
            <ParticipantCounter variant="hero" />
          </div>
        </div>

        {/* Cartaz + foto do local na mesma vista */}
        <div className="relative mx-auto mb-10 w-full max-w-sm animate-zoom-in [animation-delay:.2s] md:max-w-none">
          <div data-parallax="0.07" className="relative will-change-transform">
            <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl bg-brand" />
            <Image
              src={event.images.cover.src}
              alt={event.images.cover.alt}
              width={event.images.cover.width}
              height={event.images.cover.height}
              priority
              sizes="(min-width: 768px) 40vw, 90vw"
              className="relative h-auto w-full rounded-3xl border border-ink/10 shadow-2xl"
            />

            <div className="absolute -bottom-10 -left-3 z-10 w-40 animate-float sm:-left-12 sm:w-56">
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

      <div className="overflow-hidden border-y border-ink bg-ink py-4 text-white" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-lg font-bold uppercase tracking-wider">
          {marquee.map((word, i) => (
            <span key={i} className="flex items-center gap-10">
              {word}
              <span className="text-gold">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
