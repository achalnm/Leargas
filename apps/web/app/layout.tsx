import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Sora } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Léargas: Irish Data Analytics',
    template: '%s | Léargas',
  },
  description:
    'Analytics dashboard visualising Irish public data: housing prices, employment trends, and climate patterns from CSO, data.gov.ie, and Met Éireann.',
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
      className={`${jakarta.variable} ${sora.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
