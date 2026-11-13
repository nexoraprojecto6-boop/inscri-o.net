import type { Metadata } from 'next';
import Ticket from '@/components/Ticket';

export const metadata: Metadata = {
  title: 'O meu ingresso | Inscri-Ticket',
  robots: { index: false, follow: false },
};

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Ticket id={id} />;
}
