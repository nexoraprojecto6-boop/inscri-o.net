'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';
import { content } from '@/lib/content';

export default function Header() {
  const [open, setOpen] = useState(false);
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
        scrolled || open ? 'bg-white/90 shadow-[0_1px_0_rgba(17,17,17,.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between sm:h-20">
        <a href="#top" aria-label="Início" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {content.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/70 transition hover:text-brand"
            >
              {item.label}
            </a>
          ))}
          <a href="#inscricao" className="btn-primary !px-5 !py-2.5">
            Inscrever-me
          </a>
        </nav>

        <button
          type="button"
          className="relative grid h-11 w-11 place-items-center rounded-full border border-ink/10 md:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`absolute h-0.5 w-5 bg-ink transition ${open ? 'rotate-45' : '-translate-y-1.5'}`}
          />
          <span className={`absolute h-0.5 w-5 bg-ink transition ${open ? 'opacity-0' : ''}`} />
          <span
            className={`absolute h-0.5 w-5 bg-ink transition ${open ? '-rotate-45' : 'translate-y-1.5'}`}
          />
        </button>
      </div>

      {open && (
        <nav className="container-x flex flex-col gap-1 pb-6 md:hidden" aria-label="Móvel">
          {content.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-ink/10 py-3.5 text-lg font-semibold"
            >
              {item.label}
            </a>
          ))}
          <a href="#inscricao" onClick={() => setOpen(false)} className="btn-primary mt-4">
            Inscrever-me
          </a>
        </nav>
      )}
    </header>
  );
}
