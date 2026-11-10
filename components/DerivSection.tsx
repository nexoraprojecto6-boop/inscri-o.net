import { content } from '@/lib/content';
import DerivLink from './DerivLink';

export default function DerivSection() {
  const { deriv } = content;
  return (
    <section id="deriv" className="scroll-mt-20 bg-ink py-20 text-white sm:py-28">
      <div className="container-x grid gap-12 md:grid-cols-2 md:gap-16">
        <div className="reveal">
          <p className="eyebrow !text-gold before:!bg-gold">{deriv.eyebrow}</p>
          <h2 className="h-section mt-4">{deriv.title}</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/70">
            {deriv.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <DerivLink className="btn-gold mt-8">
            {deriv.cta}
            <span aria-hidden>↗</span>
          </DerivLink>
          <p className="mt-4 max-w-md text-xs leading-relaxed text-white/50">{deriv.disclosure}</p>
        </div>

        <aside className="reveal self-center rounded-3xl border border-gold/40 bg-white/5 p-7 sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Importante</p>
          <p className="mt-3 text-base leading-relaxed text-white/80">{deriv.risk}</p>
        </aside>
      </div>
    </section>
  );
}
