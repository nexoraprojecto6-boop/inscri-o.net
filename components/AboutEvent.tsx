import { content } from '@/lib/content';
import { event } from '@/lib/event';

export default function AboutEvent() {
  const { about } = content;
  const details = [
    { label: 'Data', value: `${event.weekday}, ${event.dateLabel}` },
    { label: 'Hora', value: event.timeLabel },
    { label: 'Local', value: `${event.venue} – ${event.city}` },
    { label: 'Entrada', value: 'Gratuita' },
  ];

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

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Oradores</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {event.speakers.map((s) => (
                <li
                  key={s.name}
                  className="rounded-2xl border border-ink/10 bg-paper px-5 py-3 font-display text-lg font-bold"
                >
                  {s.name}
                  {s.tag && <span className="ml-2 text-sm font-semibold text-brand">({s.tag})</span>}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink/55">Com o apoio da {event.support}.</p>
          </div>
        </div>

        <dl className="reveal self-start rounded-3xl bg-ink p-7 text-white sm:p-9">
          {details.map((d, i) => (
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
