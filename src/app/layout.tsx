import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Joshua Silva — Full Stack Developer | Building Digital Universes',
  description:
    'Cinematic interstellar developer portfolio. React · Next.js · TypeScript · Three.js · Node.js. U.S. Army veteran turned full-stack engineer.',
  keywords: [
    'Joshua Silva',
    'Full Stack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Three.js',
    'Portfolio',
    'Interstellar',
    '3D Web',
  ],
  authors: [{ name: 'Joshua Silva' }],
  openGraph: {
    title: 'Joshua Silva - Full Stack Developer',
    description:
      'Premium full-stack developer portfolio with runner game access gate',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joshua Silva - Full Stack Developer',
    description: 'Premium portfolio built with Next.js and React',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='utf-8' />
      </head>
      <body suppressHydrationWarning className='bg-[#0a0e27] overflow-x-hidden'>
        {children}
      </body>
    </html>
  );
}
