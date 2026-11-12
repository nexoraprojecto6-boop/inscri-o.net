import { content } from '@/lib/content';

export default function FinalCTA() {
  const { finalCta } = content;
  return (
    <section className="bg-white px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="reveal reveal-zoom relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand px-7 py-16 text-center text-white sm:px-12 sm:py-24">
        <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/70 blur-2xl" />
        <div aria-hidden className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-black/20 blur-2xl" />
        <div className="relative">
          <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/85">{finalCta.text}</p>
          <a href="#inscricao" className="btn mt-8 bg-white text-ink hover:-translate-y-0.5 hover:bg-ink hover:text-white">
            {finalCta.cta} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
