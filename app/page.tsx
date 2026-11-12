import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutEvent from '@/components/AboutEvent';
import EventLocation from '@/components/EventLocation';
import Benefits from '@/components/Benefits';
import DerivSection from '@/components/DerivSection';
import Process from '@/components/Process';
import RegistrationSection from '@/components/RegistrationSection';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import RevealObserver from '@/components/RevealObserver';
import { event } from '@/lib/event';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.title,
  description: event.subtitle,
  startDate: event.dateISO,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  isAccessibleForFree: true,
  location: {
    '@type': 'Place',
    name: event.venue,
    address: { '@type': 'PostalAddress', addressLocality: event.city, addressCountry: 'AO' },
  },
  performer: event.speakers.map((sp) => ({ '@type': 'Person', name: sp.name })),
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'AOA', availability: 'https://schema.org/InStock' },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Header />
      <main>
        <Hero />
        <AboutEvent />
        <EventLocation />
        <Benefits />
        <DerivSection />
        <Process />
        <RegistrationSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
