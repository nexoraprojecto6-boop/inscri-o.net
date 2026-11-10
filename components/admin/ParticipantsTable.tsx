import type { Participant } from '@/lib/types';
import { formatDate } from '@/lib/utils';

type Props = {
  participants: Participant[];
  matching: number;
  limit: number;
  loading: boolean;
  searching: boolean;
};

export default function ParticipantsTable({ participants, matching, limit, loading, searching }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wider text-ink/55">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Nome completo</th>
              <th className="px-5 py-3.5 font-semibold">Email</th>
              <th className="px-5 py-3.5 font-semibold">Telefone</th>
              <th className="px-5 py-3.5 font-semibold">Conta Deriv (declarada)</th>
              <th className="px-5 py-3.5 font-semibold">Inscrição</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-ink/5 transition-opacity ${loading ? 'opacity-50' : ''}`}>
            {participants.map((p) => (
              <tr key={p.id} className="hover:bg-paper/60">
                <td className="px-5 py-3.5 font-semibold">{p.full_name}</td>
                <td className="px-5 py-3.5 text-ink/75">{p.email}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-ink/75">
                  {p.country_code} {p.phone}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      p.has_deriv_account ? 'bg-gold/40 text-ink' : 'bg-paper text-ink/60'
                    }`}
                  >
                    {p.has_deriv_account ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-ink/60">{formatDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {participants.length === 0 && !loading && (
        <p className="px-5 py-12 text-center text-sm text-ink/55">
          {searching ? 'Nenhum participante corresponde à pesquisa.' : 'Ainda não há inscrições.'}
        </p>
      )}

      <p className="border-t border-ink/5 px-5 py-3 text-xs text-ink/50">
        A mostrar {participants.length} de {matching} {searching ? 'resultados' : 'participantes'}
        {matching > limit ? ` (máximo de ${limit} na tabela; o CSV exporta todos)` : ''}.
      </p>
    </div>
  );
}
