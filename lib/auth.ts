import 'server-only';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

/**
 * Devolve o utilizador autenticado apenas se também estiver na tabela `admins`.
 * Qualquer pessoa autenticada que não esteja nessa tabela é tratada como não autorizada.
 */
export async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await getAdminClient()
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return user;
}
