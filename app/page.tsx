import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutEvent from '@/components/AboutEvent';
import Benefits from '@/components/Benefits';
import DerivSection from '@/components/DerivSection';
import Process from '@/components/Process';
import RegistrationSection from '@/components/RegistrationSection';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import RevealObserver from '@/components/RevealObserver';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutEvent />
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
