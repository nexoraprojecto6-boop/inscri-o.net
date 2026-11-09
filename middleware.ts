import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Atualiza a sessão e bloqueia /admin e /api/admin a quem não tem sessão.
 * A verificação final de "é administrador" é feita no servidor (lib/auth.ts).
 */
export async function middleware(request: NextRequest) {
  const isApi = request.nextUrl.pathname.startsWith('/api/');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const deny = () =>
    isApi
      ? NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url));

  if (!url || !anonKey) return deny();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return deny();
  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
