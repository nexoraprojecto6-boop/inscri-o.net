import RegistrationForm from './RegistrationForm';
import ParticipantCounter from './ParticipantCounter';
import { content } from '@/lib/content';

export default function RegistrationSection() {
  const { form } = content;
  return (
    <section id="inscricao" className="scroll-mt-20 bg-paper py-20 sm:py-28">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="reveal reveal-left lg:sticky lg:top-28">
          <p className="eyebrow">Inscrição</p>
          <h2 className="h-section mt-4">{form.title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/70">{form.subtitle}</p>
          <div className="mt-8">
            <ParticipantCounter variant="hero" />
          </div>
        </div>

        <div className="reveal reveal-right rounded-3xl bg-white p-6 shadow-[0_30px_80px_-40px_rgba(17,17,17,.35)] sm:p-9">
          <RegistrationForm />
        </div>
      </div>
    </section>
  );
}
