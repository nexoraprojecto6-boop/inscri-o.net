import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Projeto Serio$ — Inscreve-te no evento',
  description:
    'Inscreve-te no Projeto Serio$, um evento para aprender trading com método e gestão de risco.',
  openGraph: {
    title: 'Projeto Serio$',
    description: 'Inscreve-te e recebe as novidades do evento em primeira mão.',
    type: 'website',
    locale: 'pt_PT',
  },
  icons: { icon: '/icons/favicon.svg' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#111111',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
