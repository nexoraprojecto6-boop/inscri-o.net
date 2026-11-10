import type { Stats } from '@/lib/types';

const fmt = (n: number) => new Intl.NumberFormat('pt-PT').format(n);

type CardData = { label: string; value: number | undefined; hint?: string; dark?: boolean };

/** Indicadores reais, lidos da base de dados Supabase. */
export default function StatisticsCards({ stats }: { stats: Stats | null }) {
  const cards: CardData[] = [
    { label: 'Total de inscritos', value: stats?.total_participants, dark: true },
    { label: 'Telefones recolhidos', value: stats?.total_phones },
    {
      label: 'Declararam ter conta Deriv',
      value: stats?.with_deriv_account,
      hint: 'Declaração do participante, não verificada.',
    },
    { label: 'Declararam não ter conta', value: stats?.without_deriv_account },
    {
      label: 'Cliques no link Deriv',
      value: stats?.total_clicks,
      hint: stats
        ? `${fmt(Number(stats.unique_clicks))} sessões únicas. Um clique não confirma que foi criada uma conta.`
        : undefined,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
            <p className="mt-2 font-display text-4xl font-extrabold">{fmt(Number(c.value))}</p>
          )}
          {c.hint && (
            <p className={`mt-2 text-xs leading-snug ${c.dark ? 'text-white/60' : 'text-ink/50'}`}>{c.hint}</p>
          )}
        </div>
      ))}
    </div>
  );
}
