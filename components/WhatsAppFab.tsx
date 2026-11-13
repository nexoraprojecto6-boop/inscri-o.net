'use client';

import { useWhatsappUrl } from '@/lib/use-settings';

/** Botão redondo flutuante para entrar no grupo do WhatsApp. */
export default function WhatsAppFab() {
  const url = useWhatsappUrl();
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Entrar no grupo do WhatsApp"
      title="Entrar no grupo do WhatsApp"
      className="no-print group fixed bottom-5 right-5 z-50 grid h-16 w-16 animate-zoom-in place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,.8)] transition duration-300 [animation-delay:1s] hover:scale-110 sm:bottom-8 sm:right-8"
    >
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
      <svg viewBox="0 0 32 32" className="relative h-8 w-8 fill-current" aria-hidden>
        <path d="M16 3a13 13 0 0 0-11.1 19.8L3 29l6.4-1.8A13 13 0 1 0 16 3zm0 2.3a10.7 10.7 0 1 1-5.5 19.9l-.4-.2-3.8 1 1-3.7-.3-.4A10.7 10.7 0 0 1 16 5.3zm-4.1 5.6c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.9c.2.2 2.6 4.1 6.4 5.6 3.2 1.2 3.8 1 4.5.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5l-2.5-1.2c-.3-.1-.6-.2-.9.2l-1.1 1.4c-.2.3-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.300-2.100-2.600-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.4-.6.1-.3.1-.5 0-.7l-1.100-2.700c-.3-.7-.6-.6-.8-.6h-.7z" />
      </svg>
    </a>
  );
}
