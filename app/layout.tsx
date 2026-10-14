import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getBrandConfig } from '@/lib/config/brand';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const brand = getBrandConfig();

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060913',
};

export const metadata: Metadata = {
  metadataBase: new URL(brand.appUrl),
  title: {
    default: `${brand.name} — Find Your Flight. Plan Your Journey.`,
    template: `%s | ${brand.name}`,
  },
  description:
    'Compare available flights, review transparent server-audited fares, receive confirmed itineraries with airline PNR, and manage your travel bookings in one place.',
  openGraph: {
    type: 'website',
    siteName: brand.name,
    title: `${brand.name} — Find Your Flight. Plan Your Journey.`,
    description:
      'Compare available flights, review transparent fares, and manage your booking or confirmed itinerary in one place.',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-navy-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to main content
        </a>
        <Header brandName={brand.name} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
