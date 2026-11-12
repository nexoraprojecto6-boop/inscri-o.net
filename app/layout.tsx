import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import { event } from '@/lib/event';
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

const description = `${event.subtitle}. ${event.dateLabel}, ${event.timeLabel}, ${event.venue} – ${event.city}. ${event.entry}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${event.title} | Projeto Serio$`,
  description,
  openGraph: {
    title: event.title,
    description,
    type: 'website',
    locale: 'pt_PT',
    images: [
      {
        url: event.images.cover.src,
        width: event.images.cover.width,
        height: event.images.cover.height,
        alt: event.images.cover.alt,
      },
    ],
  },
  twitter: { card: 'summary_large_image', title: event.title, description, images: [event.images.cover.src] },
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
