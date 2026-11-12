import { content } from '@/lib/content';

export default function Benefits() {
  const { benefits } = content;
  return (
    <section id="beneficios" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <div className="container-x">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{benefits.eyebrow}</p>
          <h2 className="h-section mt-4">{benefits.title}</h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {benefits.items.map((item, i) => (
            <article
              key={item.title}
              className="reveal reveal-zoom group relative overflow-hidden rounded-3xl border border-ink/5 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-24px_rgba(17,17,17,.35)] sm:p-9"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="font-display text-5xl font-extrabold text-gold transition group-hover:text-brand">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/65">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
