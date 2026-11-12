import Image from 'next/image';
import { content } from '@/lib/content';
import { event } from '@/lib/event';

export default function EventLocation() {
  const { location } = content;
  return (
    <section id="local" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
        <div className="reveal">
          <p className="eyebrow">{location.eyebrow}</p>
          <h2 className="h-section mt-4">{location.title}</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">{location.text}</p>

          <ul className="mt-6 space-y-1 font-display text-xl font-bold">
            <li>{event.dateLabel}</li>
            <li>{event.timeLabel}</li>
            <li className="text-brand">{event.entry}</li>
          </ul>

          <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-dark mt-8">
            {location.cta}
            <span aria-hidden>→</span>
          </a>
        </div>

        <figure className="reveal overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-xl">
          <Image
            src={event.images.hotel.src}
            alt={event.images.hotel.alt}
            width={event.images.hotel.width}
            height={event.images.hotel.height}
            sizes="(min-width: 768px) 55vw, 100vw"
            className="h-auto w-full"
          />
          <figcaption className="px-5 py-3 text-sm text-ink/60">
            {event.venue} · {event.city}, {event.country}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
