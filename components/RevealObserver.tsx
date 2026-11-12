'use client';

import { useEffect, useRef } from 'react';

/**
 * Efeitos de scroll da página:
 *  - revela elementos com .reveal e .stagger ao entrarem no ecrã;
 *  - barra de progresso no topo;
 *  - parallax suave em elementos com data-parallax="0.06".
 */
export default function RevealObserver() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal, .stagger');
    let io: IntersectionObserver | null = null;
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      els.forEach((el) => io?.observe(el));
    }

    const parallax = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) {
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        bar.current.style.transform = `scaleX(${p})`;
      }
      if (reduce) return;
      const vh = window.innerHeight;
      for (const el of parallax) {
        const ref = (el.parentElement ?? el).getBoundingClientRect();
        if (ref.bottom < -300 || ref.top > vh + 300) continue;
        const speed = parseFloat(el.dataset.parallax || '0.08');
        const y = (ref.top + ref.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={bar}
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-brand via-gold to-brand"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}
