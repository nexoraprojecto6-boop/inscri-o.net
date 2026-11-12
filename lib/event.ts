/**
 * Fonte única dos dados do evento (retirados da capa oficial).
 * Usada pela landing (Hero, AboutEvent, EventLocation, SEO) e pelo painel /admin.
 * Para alterar data, local ou oradores, edita só este ficheiro.
 */
export const event = {
  title: 'Análises técnicas e introdução a Deriv bot',
  subtitle: 'Aprenda a analisar o mercado e a operar com Deriv bot',
  support: 'Deriv Partners',
  motto: ['Aprenda', 'Pratique', 'Evolua'],

  // 28/11/2026, 15h, hora de Angola (UTC+1)
  dateISO: '2026-11-28T15:00:00+01:00',
  weekday: 'Sábado',
  dateLabel: '28 de Novembro de 2026',
  dateShort: '28 Nov 2026',
  timeLabel: '15h',

  venue: 'Hotel Flow',
  city: 'Benguela',
  country: 'Angola',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Hotel+Flow+Benguela+Angola',

  entry: 'Entrada gratuita',

  speakers: [
    { name: 'Kelvin da Silva', tag: '' },
    { name: 'Domingos Fernando', tag: 'Fx' },
  ],

  disclaimer: 'Não é aconselhamento de investimento. Opere com responsabilidade e entenda os riscos.',

  images: {
    cover: {
      src: '/images/evento-capa.png',
      width: 1128,
      height: 1394,
      alt: 'Capa do evento: Análises técnicas e introdução a Deriv bot, 28 de Novembro de 2026, Hotel Flow, Benguela',
    },
    hotel: {
      src: '/images/hotel-flow.jpg',
      width: 1024,
      height: 768,
      alt: 'Fachada iluminada do Hotel Flow, em Benguela, ao entardecer',
    },
  },
} as const;

/** Contagem decrescente até ao evento (calculada no browser). */
export function eventCountdown(now: number = Date.now()) {
  const diff = new Date(event.dateISO).getTime() - now;
  if (diff > 0) return { state: 'upcoming' as const, days: Math.ceil(diff / 86_400_000) };
  if (diff > -12 * 3_600_000) return { state: 'today' as const, days: 0 };
  return { state: 'done' as const, days: 0 };
}
