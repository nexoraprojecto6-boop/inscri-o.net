import { content } from '@/lib/content';

export default function FAQ() {
  const { faq } = content;
  return (
    <section id="faq" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="container-x grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div className="reveal">
          <p className="eyebrow">{faq.eyebrow}</p>
          <h2 className="h-section mt-4">{faq.title}</h2>
        </div>

        <div className="reveal divide-y divide-ink/10 border-y border-ink/10">
          {faq.items.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 text-xl transition group-open:rotate-45 group-open:border-brand group-open:bg-brand group-open:text-white"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-xl leading-relaxed text-ink/65">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
