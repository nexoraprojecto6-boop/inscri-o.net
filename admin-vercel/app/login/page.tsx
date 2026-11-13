'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Não foi possível entrar.');
        return;
      }
      window.location.href = '/';
    } catch {
      setError('Sem ligação. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login">
      <form onSubmit={onSubmit} className="card login-card">
        <p className="brand">
          Inscri<span>-Ticket</span>
        </p>
        <h1>Painel</h1>
        <label htmlFor="password">Palavra-passe</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="msg err">{error}</p>}
        <button className="btn" disabled={loading || !password}>
          {loading ? 'A entrar…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
