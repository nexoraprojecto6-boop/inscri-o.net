// Config própria e vazia: impede o Next de apanhar o postcss.config.mjs da pasta-mãe (que usa Tailwind,
// não instalado neste painel) e falhar na compilação do CSS.
const config = { plugins: {} };

export default config;
