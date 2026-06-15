import type { Metadata } from 'next';
import { Fraunces, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
  style: ['normal', 'italic'],
});

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Léargas: Irish Data Analytics',
    template: '%s | Léargas',
  },
  description:
    'Analytics dashboard visualising Irish public data: housing prices, employment trends, and climate patterns from CSO and Met Éireann.',
  keywords: ['Ireland', 'data analytics', 'housing prices', 'CSO', 'Met Éireann', 'dashboard'],
  authors: [{ name: 'Léargas' }],
  openGraph: {
    title: 'Léargas: Irish Data Analytics',
    description: 'Visualise real Irish public data in a beautiful, interactive dashboard.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSerif.variable} ${ibmPlexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
