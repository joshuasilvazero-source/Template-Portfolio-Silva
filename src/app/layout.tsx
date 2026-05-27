import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Joshua Silva — Frontend Engineer | Building Digital Universes',
  description:
    'Cinematic interstellar developer portfolio. React · Next.js · TypeScript · Three.js · Tailwind CSS. U.S. Army veteran turned frontend engineer.',
  keywords: [
    'Joshua Silva',
    'Frontend Engineer',
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
    title: 'Joshua Silva - Frontend Engineer',
    description:
      'Premium frontend engineer portfolio with immersive Three.js experiences',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joshua Silva - Frontend Engineer',
    description: 'Premium frontend portfolio built with Next.js and React',
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
      <body suppressHydrationWarning className='bg-[#0a0e27] overflow-x-clip'>
        {children}
      </body>
    </html>
  );
}
