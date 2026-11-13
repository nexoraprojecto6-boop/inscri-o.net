import RegistrationForm from './RegistrationForm';
import { content } from '@/lib/content';

export default function RegistrationSection() {
  const { form } = content;
  return (
    <section id="inscricao" className="scroll-mt-20 bg-ink py-14 sm:py-20">
      <div className="container-x max-w-xl">
        <div className="text-center text-white">
          <p className="eyebrow !text-gold">Inscrição</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">{form.title}</h2>
          <p className="mt-3 text-white/70">Preenche os 4 campos e recebe o teu ingresso na hora.</p>
        </div>

        <div className="reveal reveal-zoom mt-8 rounded-3xl bg-white p-6 shadow-2xl sm:p-9">
          <RegistrationForm />
        </div>
      </div>
    </section>
  );
}
