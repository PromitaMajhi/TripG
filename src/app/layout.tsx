import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display, Hind_Siliguri } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  variable: '--font-hind',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'TripG — Vadodara Tour & Route Navigator',
  description: 'Explore all 11 sacred Vadodara destinations with live Google Maps GPS turn-by-turn navigation from Parul University to Kishanwadi.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TripG',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0614',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable} ${hindSiliguri.variable}`}>
      <body className="antialiased selection:bg-pink-500 selection:text-white">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1032',
              color: '#ffffff',
              border: '1px solid rgba(255, 46, 147, 0.4)',
              borderRadius: '16px',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 16px 36px rgba(0,0,0,0.7), 0 0 20px rgba(255, 46, 147, 0.35)',
              fontSize: '0.88rem',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
