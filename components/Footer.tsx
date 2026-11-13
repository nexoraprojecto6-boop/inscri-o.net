import Logo from './Logo';
import { content } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="bg-ink py-12 text-white">
      <div className="container-x flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo light />
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">{content.footer.note}</p>
        </div>
      </div>
      <div className="container-x mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
        © {new Date().getFullYear()} Inscri-Ticket. Todos os direitos reservados.
      </div>
    </footer>
  );
}
