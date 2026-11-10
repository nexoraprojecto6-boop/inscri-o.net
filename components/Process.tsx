import { content } from '@/lib/content';

export default function Process() {
  const { process } = content;
  return (
    <section id="processo" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="container-x">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{process.eyebrow}</p>
          <h2 className="h-section mt-4">{process.title}</h2>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((s, i) => (
            <li
              key={s.title}
              className="reveal relative border-t-2 border-ink pt-6"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand font-display text-lg font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
