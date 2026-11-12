import Image from 'next/image';
import { content } from '@/lib/content';
import { event } from '@/lib/event';
import ParticipantCounter from './ParticipantCounter';

export default async function Hero() {
  const { hero } = content;
  const marquee = [...hero.marquee, ...hero.marquee];
  const chips = [event.dateShort, event.timeLabel, `${event.venue} · ${event.city}`, event.entry];

  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-28 sm:pt-36">
      {/* Forma decorativa */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] rounded-full bg-gold/60 blur-3xl sm:h-[560px] sm:w-[560px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-brand/15 blur-3xl"
      />

      <div className="container-x relative grid items-center gap-14 pb-20 sm:pb-28 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow animate-fade-up">{hero.eyebrow}</p>

          <h1 className="mt-5 max-w-3xl animate-fade-up font-display text-[2.6rem] font-extrabold leading-[0.98] tracking-tight [animation-delay:.08s] sm:text-6xl lg:text-7xl">
            {hero.title}
            <span className="mt-2 block text-brand">{hero.highlight}</span>
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up font-display text-xl font-bold [animation-delay:.12s]">
            {event.title}
          </p>

          <p className="mt-3 max-w-xl animate-fade-up text-lg leading-relaxed text-ink/70 [animation-delay:.16s]">
            {hero.description}
          </p>

          <ul className="mt-6 flex animate-fade-up flex-wrap gap-2 text-sm font-semibold [animation-delay:.2s]">
            {chips.map((c) => (
              <li key={c} className="rounded-full border border-ink/15 bg-white px-4 py-1.5">
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:.24s] sm:flex-row">
            <a href="#inscricao" className="btn-primary">
              {hero.cta}
              <span aria-hidden>→</span>
            </a>
            <a href="#evento" className="btn-ghost">
              {hero.secondaryCta}
            </a>
          </div>

          <div className="mt-10 animate-fade-up [animation-delay:.32s]">
            <ParticipantCounter variant="hero" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm animate-fade-up [animation-delay:.2s] md:max-w-none">
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
