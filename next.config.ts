import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/**
 * Modo "landing na Vercel + API/admin na Render".
 *
 * Se RENDER_API_URL estiver definida (apenas no projeto da Vercel), esta instância:
 *  - reencaminha (proxy) /api/* para o serviço da Render, no servidor. O browser fala
 *    sempre com o domínio da Vercel, por isso não há CORS nem credenciais no frontend;
 *  - redireciona /admin e /login para o painel que vive na Render.
 *
 * Na Render esta variável NÃO deve existir: o serviço responde diretamente.
 * A base de dados e todas as credenciais ficam só no dashboard da Render.
 */
function getRenderOrigin(): string | null {
  const raw = process.env.RENDER_API_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return null;
    return url.origin;
  } catch {
    return null;
  }
}

const renderOrigin = getRenderOrigin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async rewrites() {
    if (!renderOrigin) return [];
    return {
      beforeFiles: [{ source: '/api/:path*', destination: `${renderOrigin}/api/:path*` }],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    if (!renderOrigin) return [];
    return [
      { source: '/admin', destination: `${renderOrigin}/admin`, permanent: false },
      { source: '/admin/:path*', destination: `${renderOrigin}/admin/:path*`, permanent: false },
      { source: '/login', destination: `${renderOrigin}/login`, permanent: false },
    ];
  },
};

export default nextConfig;
