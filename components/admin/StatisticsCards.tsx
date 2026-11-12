import type { Stats } from '@/lib/types';

const fmt = (n: number) => new Intl.NumberFormat('pt-PT').format(n);

type CardData = { label: string; value: string | number | undefined; hint?: string; dark?: boolean };

const pct = (part: number, total: number) => (total > 0 ? `${Math.round((part / total) * 100)}%` : '0%');

/** Indicadores reais, lidos da base de dados PostgreSQL. */
export default function StatisticsCards({ stats }: { stats: Stats | null }) {
  const cards: CardData[] = [
    { label: 'Total de inscritos', value: stats?.total_participants, dark: true },
    { label: 'Inscrições hoje', value: stats?.registrations_today, hint: 'Dia de calendário em hora de Angola.' },
    { label: 'Últimos 7 dias', value: stats?.registrations_7d },
    { label: 'Telefones recolhidos', value: stats?.total_phones },
    {
      label: 'Declararam ter conta Deriv',
      value: stats?.with_deriv_account,
      hint: stats
        ? `${pct(Number(stats.with_deriv_account), Number(stats.total_participants))} dos inscritos. Declaração do participante, não verificada.`
        : undefined,
    },
    { label: 'Declararam não ter conta', value: stats?.without_deriv_account },
    {
      label: 'Cliques no link Deriv',
      value: stats?.total_clicks,
      hint: stats
        ? `${fmt(Number(stats.unique_clicks))} sessões únicas. Um clique não confirma que foi criada uma conta.`
        : undefined,
    },
    {
      label: 'Cliques / inscritos',
      value: stats ? pct(Number(stats.total_clicks), Number(stats.total_participants)) : undefined,
      hint: 'Indicador de interesse, não de contas criadas.',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-2xl p-5 ${c.dark ? 'bg-ink text-white' : 'border border-ink/10 bg-white'}`}
        >
          <p className={`text-xs font-semibold uppercase tracking-wider ${c.dark ? 'text-gold' : 'text-ink/55'}`}>
            {c.label}
          </p>
          {c.value === undefined ? (
            <div className="mt-3 h-9 w-20 animate-pulse rounded bg-ink/10" />
          ) : (
            <p className="mt-2 font-display text-4xl font-extrabold">
              {typeof c.value === 'number' ? fmt(Number(c.value)) : c.value}
            </p>
          )}
          {c.hint && (
            <p className={`mt-2 text-xs leading-snug ${c.dark ? 'text-white/60' : 'text-ink/50'}`}>{c.hint}</p>
          )}
        </div>
      ))}
    </div>
  );
}
