import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getAdminUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Painel administrativo | Inscri-Ticket',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // O middleware já exige sessão; aqui confirmamos de novo no servidor.
  const admin = await getAdminUser().catch(() => null);
  if (!admin) redirect('/login');

  return <AdminDashboard email={admin.email} />;
}
