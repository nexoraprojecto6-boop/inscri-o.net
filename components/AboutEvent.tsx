import { content } from '@/lib/content';

export default function AboutEvent() {
  const { about } = content;
  return (
    <section id="evento" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="container-x grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div className="reveal">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 className="h-section mt-4">{about.title}</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/70">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <dl className="reveal self-start rounded-3xl bg-ink p-7 text-white sm:p-9">
          {about.eventDetails.map((d, i) => (
            <div
              key={d.label}
              className={`py-4 ${i > 0 ? 'border-t border-white/15' : ''} ${i === 0 ? 'pt-0' : ''}`}
            >
              <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{d.label}</dt>
              <dd className="mt-1 font-display text-2xl font-bold">{d.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
