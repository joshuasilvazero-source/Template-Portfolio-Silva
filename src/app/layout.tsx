import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import { site } from '@/content/site';
import '@/styles/tailwind.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-bricolage',
  display: 'swap',
});

const body = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
});

const title = `${site.businessName} | Freelance Web Designer in Colorado Springs`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `%s | ${site.businessName}` },
  description: site.description,
  applicationName: site.businessName,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: site.businessName,
    title,
    description: site.description,
    url: '/',
  },
  twitter: { card: 'summary_large_image', title, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#1b2430',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' data-scroll-behavior='smooth' className={`${display.variable} ${body.variable}`}>
      <body className='min-h-screen overflow-x-clip bg-sky'>{children}</body>
    </html>
  );
}
