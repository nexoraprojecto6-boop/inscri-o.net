'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled ? 'bg-white/90 shadow-[0_1px_0_rgba(17,17,17,.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between sm:h-20">
        <a href="#top" aria-label="Início">
          <Logo />
        </a>
        <a href="#inscricao" className="btn-primary !px-5 !py-2.5">
          Inscrever-me
        </a>
      </div>
    </header>
  );
}
