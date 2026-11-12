'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { registrationSchema } from '@/lib/validations';
import { COUNTRIES, DEFAULT_COUNTRY_CODE } from '@/lib/countries';
import { content } from '@/lib/content';
import { saveParticipantId } from '@/lib/utils';
import DerivLink from './DerivLink';

type FieldErrors = Partial<Record<string, string>>;

export default function RegistrationForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [phone, setPhone] = useState('');
  const [hasDeriv, setHasDeriv] = useState<boolean | null>(null);
  const [sms, setSms] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot (campo isco)

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const startedAt = useRef<number>(0);
  const submitting = useRef(false);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting.current) return; // evita submissões duplicadas
    setFormError('');

    const parsed = registrationSchema.safeParse({
      fullName,
      email,
      countryCode,
      phone,
      hasDerivAccount: hasDeriv === null ? undefined : hasDeriv,
      smsConsent: sms,
      whatsappConsent: whatsapp,
    });

    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const next: FieldErrors = {};
      for (const [k, v] of Object.entries(flat)) if (v?.[0]) next[k] = v[0];
      setErrors(next);
      return;
    }
    setErrors({});

    submitting.current = true;
    setLoading(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...parsed.data,
          website,
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        id?: string;
        error?: string;
        fields?: Record<string, string[]>;
      };

      if (!res.ok) {
        if (data.fields) {
          const next: FieldErrors = {};
          for (const [k, v] of Object.entries(data.fields)) if (v?.[0]) next[k] = v[0];
          setErrors(next);
        }
        setFormError(data.error ?? 'Ocorreu um erro. Tenta novamente.');
        return;
      }

      if (data.id) {
        saveParticipantId(data.id);
        setTicketId(data.id);
      }
      setDone(true);
      window.dispatchEvent(new Event('registration:created'));
    } catch {
      setFormError('Sem ligação ao servidor. Verifica a internet e tenta novamente.');
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="py-8 text-center" role="status">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-3xl">✓</div>
        <h3 className="mt-5 font-display text-3xl font-extrabold">{content.form.success.title}</h3>
        <p className="mx-auto mt-3 max-w-sm text-ink/70">{content.form.success.text}</p>
        {ticketId && (
          <Link href={`/ingresso/${ticketId}`} className="btn-primary mt-6">
            Ver e imprimir o meu ingresso <span aria-hidden>→</span>
          </Link>
        )}
        {hasDeriv === false && (
          <div className="mt-8 rounded-2xl bg-paper p-5">
            <p className="text-sm text-ink/70">Ainda não tens conta na Deriv? Podes criá-la quando quiseres.</p>
            <DerivLink className="btn-primary mt-4">Criar conta na Deriv ↗</DerivLink>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Campo isco: invisível para pessoas, bots tendem a preenchê-lo */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label htmlFor="fullName" className="label">
          Nome completo
        </label>
        <input
          id="fullName"
          className={`field ${errors.fullName ? 'field-error' : ''}`}
          autoComplete="name"
          placeholder="O teu nome e apelido"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? 'fullName-err' : undefined}
        />
        {errors.fullName && (
          <p id="fullName-err" className="error-text">
            {errors.fullName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          className={`field ${errors.email ? 'field-error' : ''}`}
          autoComplete="email"
          placeholder="nome@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-err' : undefined}
        />
        {errors.email && (
          <p id="email-err" className="error-text">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <span className="label">Telefone</span>
        <div className="flex gap-3">
          <select
            aria-label="Indicativo internacional"
            className={`field !w-[9.5rem] shrink-0 ${errors.countryCode ? 'field-error' : ''}`}
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            {COUNTRIES.map((c) => (
              <option key={`${c.code}-${c.name}`} value={c.code}>
                {c.code} {c.name}
              </option>
            ))}
          </select>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            aria-label="Número de telefone"
            className={`field ${errors.phone ? 'field-error' : ''}`}
            autoComplete="tel-national"
            placeholder="923 456 789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={!!errors.phone}
          />
        </div>
        {(errors.phone || errors.countryCode) && (
          <p className="error-text">{errors.phone ?? errors.countryCode}</p>
        )}
      </div>

      <fieldset>
        <legend className="label">Já tens uma conta na Deriv?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: true, label: 'Sim, já tenho conta.' },
            { value: false, label: 'Não, ainda não tenho conta.' },
          ].map((opt) => {
            const active = hasDeriv === opt.value;
            return (
              <label
                key={String(opt.value)}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 text-[15px] transition ${
                  active ? 'border-brand bg-brand/5 font-semibold' : 'border-ink/15 hover:border-ink/40'
                } ${errors.hasDerivAccount ? 'border-brand' : ''}`}
              >
                <input
                  type="radio"
                  name="hasDeriv"
                  className="h-4 w-4 accent-[#E32636]"
                  checked={active}
                  onChange={() => setHasDeriv(opt.value)}
                />
                {opt.label}
              </label>
            );
          })}
        </div>
        {errors.hasDerivAccount && <p className="error-text">{errors.hasDerivAccount}</p>}

        {hasDeriv === false && (
          <div className="mt-4 flex flex-col items-start gap-3 rounded-xl bg-paper p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink/70">Podes criar a tua conta agora através do nosso link de afiliado.</p>
            <DerivLink className="btn-gold shrink-0 !py-2.5">Criar conta ↗</DerivLink>
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-3 rounded-xl bg-paper p-4">
        <legend className="sr-only">Consentimentos (opcionais)</legend>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/80">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[#E32636]"
            checked={sms}
            onChange={(e) => setSms(e.target.checked)}
          />
          Aceito receber comunicações por SMS.
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/80">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[#E32636]"
            checked={whatsapp}
            onChange={(e) => setWhatsapp(e.target.checked)}
          />
          Aceito receber comunicações pelo WhatsApp.
        </label>
      </fieldset>

      {formError && (
        <p role="alert" className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-brand">
          {formError}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            A enviar…
          </>
        ) : (
          'Confirmar inscrição'
        )}
      </button>

      <p className="text-center text-xs text-ink/50">
        Os teus dados são usados apenas para te contactar sobre o Projeto Serio$.
      </p>
    </form>
  );
}
