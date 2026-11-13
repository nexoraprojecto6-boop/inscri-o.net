/**
 * Todos os textos e dados da landing page estão aqui.
 * Edita este ficheiro para alterar conteúdos sem mexer nos componentes.
 *
 * Nota: os dados do evento (data, hora, local, oradores) vivem em lib/event.ts.
 */
export const content = {
  brand: { name: 'Inscri-Ticket', short: 'Inscri-Ticket' },

  nav: [
    { label: 'O evento', href: '#evento' },
    { label: 'Local', href: '#local' },
    { label: 'Benefícios', href: '#beneficios' },
    { label: 'Deriv', href: '#deriv' },
    { label: 'Como participar', href: '#processo' },
    { label: 'FAQ', href: '#faq' },
  ],

  hero: {
    eyebrow: 'Inscrições abertas · Entrada gratuita',
    description:
      'Aprende a analisar o mercado e a operar com Deriv bot, com método e responsabilidade. Inscreve-te e recebe as novidades do evento.',
    cta: 'Quero participar',
    secondaryCta: 'Saber mais',
    marquee: ['Aprenda', 'Pratique', 'Evolua', 'Análise técnica', 'Deriv bot', 'Gerir risco'],
  },

  about: {
    eyebrow: 'O evento',
    title: 'Um ponto de partida sério para quem quer aprender.',
    paragraphs: [
      'No dia 28 de Novembro de 2026, às 15h, no Hotel Flow, em Benguela, vais aprender a fazer análises técnicas e dar os primeiros passos com o Deriv bot, de forma clara, prática e responsável.',
      'Ao inscreveres-te, ficas na lista de participantes e és informado sobre os próximos passos do evento.',
    ],
  },

  benefits: {
    eyebrow: 'Porque participar',
    title: 'O que ganhas ao inscreveres-te',
    items: [
      {
        title: 'Conteúdo claro',
        text: 'Explicações diretas, sem jargão desnecessário, para quem está a começar ou quer organizar o que já sabe.',
      },
      {
        title: 'Foco na gestão de risco',
        text: 'Aprender a proteger o capital vem antes de qualquer promessa de resultados.',
      },
      {
        title: 'Comunidade',
        text: 'Partilha dúvidas e experiências com outras pessoas com o mesmo objetivo de aprender.',
      },
      {
        title: 'Novidades em primeira mão',
        text: 'Quem se inscreve recebe as informações do evento assim que forem divulgadas.',
      },
    ],
  },

  deriv: {
    eyebrow: 'A plataforma',
    title: 'O que é a Deriv?',
    paragraphs: [
      'A Deriv é uma plataforma online de trading que permite aceder a diferentes mercados e instrumentos financeiros através de uma conta pessoal.',
      'Ter conta não é obrigatório para te inscreveres. Se ainda não tens, podes criá-la através do nosso link de afiliado quando quiseres.',
    ],
    cta: 'Criar conta na Deriv',
    disclosure:
      'Transparência: este é um link de afiliado. A Inscri-Ticket pode receber uma comissão se criares conta, sem custo adicional para ti.',
    risk:
      'Aviso de risco: o trading envolve risco elevado e pode resultar na perda do capital investido. Investe apenas o que podes perder. Este evento não constitui aconselhamento financeiro nem garante resultados.',
  },

  process: {
    eyebrow: 'Como participar',
    title: 'Quatro passos simples',
    steps: [
      { title: 'Preenche o formulário', text: 'Indica o teu nome, email e telefone.' },
      { title: 'Diz-nos se tens conta Deriv', text: 'Se não tens, podes criar uma quando quiseres.' },
      { title: 'Confirma a inscrição', text: 'Recebes a confirmação no ecrã imediatamente.' },
      { title: 'Acompanha as novidades', text: 'Contactamos-te pelos canais que autorizares.' },
    ],
  },

  faq: {
    eyebrow: 'Perguntas frequentes',
    title: 'Dúvidas? Temos respostas.',
    items: [
      {
        q: 'A inscrição tem custos?',
        a: 'Não. A inscrição e a entrada no evento são gratuitas.',
      },
      {
        q: 'Preciso de ter conta na Deriv para me inscrever?',
        a: 'Não. Podes inscrever-te com ou sem conta. Se não tiveres, o formulário mostra um botão para a criares quando quiseres.',
      },
      {
        q: 'Quando e onde decorre o evento?',
        a: 'No dia 28 de Novembro de 2026, às 15h, no Hotel Flow, em Benguela. A entrada é gratuita.',
      },
      {
        q: 'Quem são os oradores?',
        a: 'Kelvin da Silva e Domingos Fernando (Fx), com o apoio da Deriv Partners.',
      },
      {
        q: 'Como vão usar os meus dados?',
        a: 'Os teus dados servem apenas para te contactar sobre este evento e são guardados de forma protegida. Só recebes SMS ou WhatsApp se marcares essa autorização.',
      },
      {
        q: 'Clicar no link da Deriv cria logo uma conta?',
        a: 'Não. O link leva-te ao site da Deriv, onde decides se queres criar conta.',
      },
      {
        q: 'O evento garante lucros?',
        a: 'Não. O trading envolve risco e podes perder dinheiro. O objetivo é educativo.',
      },
    ],
  },

  location: {
    eyebrow: 'Onde',
    title: 'Hotel Flow, em Benguela.',
    text: 'O evento decorre no Hotel Flow, em Benguela. Abre o mapa para veres como chegar.',
    cta: 'Ver no mapa',
  },

  finalCta: {
    title: 'Garante já o teu lugar.',
    text: 'A inscrição demora menos de um minuto.',
    cta: 'Inscrever-me agora',
  },

  form: {
    title: 'Garante o teu ingresso',
    subtitle: 'Preenche os dados abaixo. É rápido e gratuito.',
    success: {
      title: 'Inscrição confirmada!',
      text: 'Obrigado por te inscreveres. Entraremos em contacto com as novidades do evento.',
    },
  },

  footer: {
    note: 'Conteúdo educativo. Não é aconselhamento de investimento. O trading envolve risco de perda do capital.',
  },
} as const;
