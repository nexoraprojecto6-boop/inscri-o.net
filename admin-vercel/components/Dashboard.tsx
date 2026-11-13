'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Participant = {
  id: string;
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  has_deriv_account: boolean;
  clicked_deriv: boolean;
  created_at: string;
};

type Summary = {
  stats: {
    total: number;
    with_deriv: number;
    without_deriv: number;
    deriv_clicks: number;
    deriv_clicks_unique: number;
    no_account_clicked: number;
  };
  participants: Participant[];
  settings: { whatsappUrl: string; derivUrl: string | null };
  limit: number;
};

type Audience = 'all' | 'no_deriv' | 'with_deriv';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-PT', { timeZone: 'Africa/Luanda', dateStyle: 'short', timeStyle: 'short' });

const mailtoFor = (emails: string[]) =>
  `mailto:?bcc=${emails.map((e) => encodeURIComponent(e).replace('%40', '@')).join(',')}`;

/** Divide os emails em lotes para o link mailto não ficar demasiado grande. */
function chunkEmails(emails: string[], maxLen = 1500): string[][] {
  const batches: string[][] = [];
  let current: string[] = [];
  let len = 0;
  for (const e of emails) {
    if (current.length && len + e.length + 1 > maxLen) {
      batches.push(current);
      current = [];
      len = 0;
    }
    current.push(e);
    len += e.length + 1;
  }
  if (current.length) batches.push(current);
  return batches;
}

export default function Dashboard() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [derivUrl, setDerivUrl] = useState('');
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const [audience, setAudience] = useState<Audience>('all');
  const [showBatches, setShowBatches] = useState(false);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/summary', { cache: 'no-store' });
      if (res.status === 401) {
        const maybe = (await res.clone().json().catch(() => ({}))) as { error?: string };
        // 401 do painel (sessão expirada) vs 401 da Render (chave errada)
        if (maybe.error === 'Não autorizado.') {
          window.location.href = '/login';
          return;
        }
      }
      const body = (await res.json()) as Summary & { error?: string };
      if (!res.ok) throw new Error(body.error ?? 'Erro ao carregar.');
      setData(body);
      setWhatsappUrl(body.settings.whatsappUrl ?? '');
      setDerivUrl(body.settings.derivUrl ?? '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveLinks(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappUrl: whatsappUrl.trim(), derivUrl: derivUrl.trim() }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSaveMsg({ ok: false, text: body.error ?? 'Não foi possível guardar.' });
        return;
      }
      setSaveMsg({ ok: true, text: 'Links guardados. A página já usa os novos links.' });
    } catch {
      setSaveMsg({ ok: false, text: 'Sem ligação. Tenta novamente.' });
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  const participants = useMemo(() => data?.participants ?? [], [data]);

  const audienceList = useMemo(
    () =>
      participants.filter((p) =>
        audience === 'all' ? true : audience === 'no_deriv' ? !p.has_deriv_account : p.has_deriv_account,
      ),
    [participants, audience],
  );
  const emails = useMemo(() => Array.from(new Set(audienceList.map((p) => p.email))), [audienceList]);
  const batches = useMemo(() => chunkEmails(emails), [emails]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return participants;
    const digits = q.replace(/\D/g, '');
    return participants.filter(
      (p) =>
        p.full_name.toLowerCase().includes(q) ||
        p.email.includes(q) ||
        (digits.length >= 3 && p.phone.includes(digits)),
    );
  }, [participants, search]);

  function sendToAll() {
    if (!emails.length) return;
    if (batches.length === 1) {
      window.location.href = mailtoFor(batches[0]);
    } else {
      setShowBatches(true);
    }
  }

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(emails.join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copia os emails:', emails.join(', '));
    }
  }

  const s = data?.stats;

  return (
    <main className="wrap">
      <header className="top">
        <p className="brand">
          Inscri<span>-Ticket</span> <small>Painel</small>
        </p>
        <div className="row">
          <button className="btn ghost" onClick={load} disabled={loading}>
            {loading ? 'A atualizar…' : 'Atualizar'}
          </button>
          <button className="btn ghost" onClick={logout}>
            Sair
          </button>
        </div>
      </header>

      {error && (
        <p className="msg err" role="alert">
          {error}
        </p>
      )}

      <section className="stats">
        <Stat label="Inscritos" value={s?.total} dark />
        <Stat label="Declararam não ter conta Deriv" value={s?.without_deriv} />
        <Stat
          label="Clicaram no link da Deriv"
          value={s?.deriv_clicks}
          hint={s ? `${s.deriv_clicks_unique} pessoas/sessões diferentes` : undefined}
        />
        <Stat
          label="Sem conta que clicaram no link"
          value={s?.no_account_clicked}
          hint="Participantes que disseram não ter conta e abriram o link."
        />
      </section>

      <section className="card">
        <h2>Links</h2>
        <form onSubmit={saveLinks} className="form">
          <label htmlFor="wa">Link do grupo de WhatsApp</label>
          <input
            id="wa"
            type="url"
            inputMode="url"
            placeholder="https://chat.whatsapp.com/..."
            value={whatsappUrl}
            onChange={(e) => setWhatsappUrl(e.target.value)}
          />
          <label htmlFor="dv">Link de afiliado da Deriv</label>
          <input
            id="dv"
            type="url"
            inputMode="url"
            placeholder="https://..."
            value={derivUrl}
            onChange={(e) => setDerivUrl(e.target.value)}
          />
          <div className="row">
            <button className="btn" disabled={saving}>
              {saving ? 'A guardar…' : 'Guardar links'}
            </button>
            {saveMsg && <span className={`msg ${saveMsg.ok ? 'ok' : 'err'}`}>{saveMsg.text}</span>}
          </div>
          <p className="hint">Deixa um campo vazio para voltar ao link por omissão.</p>
        </form>
      </section>

      <section className="card">
        <h2>Email para todos</h2>
        <div className="row wrap-row">
          <select
            value={audience}
            onChange={(e) => {
              setAudience(e.target.value as Audience);
              setShowBatches(false);
            }}
          >
            <option value="all">Todos os inscritos</option>
            <option value="no_deriv">Só quem não tem conta Deriv</option>
            <option value="with_deriv">Só quem tem conta Deriv</option>
          </select>
          <span className="hint">{emails.length} emails</span>
        </div>
        <div className="row wrap-row">
          <button className="btn" onClick={sendToAll} disabled={!emails.length}>
            Enviar email para todos
          </button>
          <button className="btn ghost" onClick={copyEmails} disabled={!emails.length}>
            {copied ? 'Copiado!' : 'Copiar emails'}
          </button>
        </div>
        <p className="hint">
          Abre a tua app de email com todos em cópia oculta (BCC), prontos a escrever a mensagem. Se forem muitos, o
          envio divide-se em lotes.
        </p>
        {showBatches && (
          <div className="row wrap-row">
            {batches.map((b, i) => (
              <a key={i} className="btn ghost" href={mailtoFor(b)}>
                Lote {i + 1} de {batches.length} ({b.length})
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <div className="row between wrap-row">
          <h2>Participantes ({participants.length})</h2>
          <input
            type="search"
            className="search"
            placeholder="Procurar nome, email ou número"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contacto</th>
                <th>Email</th>
                <th>Conta Deriv</th>
                <th>Clicou no link</th>
                <th>Inscrição</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.full_name}</td>
                  <td>
                    <a href={`tel:${p.country_code}${p.phone}`}>
                      {p.country_code} {p.phone}
                    </a>
                  </td>
                  <td>{p.email}</td>
                  <td>{p.has_deriv_account ? 'Sim' : 'Não'}</td>
                  <td>{p.clicked_deriv ? 'Sim' : '—'}</td>
                  <td>{fmtDate(p.created_at)}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">
                    Sem participantes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {data && participants.length >= data.limit && <p className="hint">A mostrar os {data.limit} mais recentes.</p>}
      </section>
    </main>
  );
}

function Stat({ label, value, hint, dark }: { label: string; value?: number; hint?: string; dark?: boolean }) {
  return (
    <div className={`stat ${dark ? 'dark' : ''}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value === undefined ? '…' : value}</p>
      {hint && <p className="stat-hint">{hint}</p>}
    </div>
  );
}
