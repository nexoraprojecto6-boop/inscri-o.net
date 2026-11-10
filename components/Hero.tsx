import { content } from '@/lib/content';
import ParticipantCounter from './ParticipantCounter';

export default async function Hero() {
  const { hero } = content;
  const marquee = [...hero.marquee, ...hero.marquee];

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

      <div className="container-x relative pb-20 sm:pb-28">
        <p className="eyebrow animate-fade-up">{hero.eyebrow}</p>

        <h1 className="mt-5 max-w-4xl animate-fade-up font-display text-[2.75rem] font-extrabold leading-[0.98] tracking-tight [animation-delay:.08s] sm:text-7xl md:text-8xl">
          {hero.title}
          <span className="mt-2 block text-brand">{hero.highlight}</span>
        </h1>

        <p className="mt-7 max-w-xl animate-fade-up text-lg leading-relaxed text-ink/70 [animation-delay:.16s]">
          {hero.description}
        </p>

        <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:.24s] sm:flex-row">
          <a href="#inscricao" className="btn-primary">
            {hero.cta}
            <span aria-hidden>→</span>
          </a>
          <a href="#evento" className="btn-ghost">
            {hero.secondaryCta}
          </a>
        </div>

        <div className="mt-12 animate-fade-up [animation-delay:.32s]">
          <ParticipantCounter variant="hero" />
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
