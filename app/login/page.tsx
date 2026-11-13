import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import LoginForm from '@/components/LoginForm';
import { getAdminUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Entrar | Inscri-Ticket',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Quem já tem sessão válida vai diretamente para o painel.
  const admin = await getAdminUser().catch(() => null);
  if (admin) redirect('/admin');

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo light />
          <p className="mt-2 text-sm text-white/50">Acesso reservado a administradores</p>
        </div>
        <div className="rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
          <h1 className="mb-6 font-display text-2xl font-extrabold">Entrar</h1>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
