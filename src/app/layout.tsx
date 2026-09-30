import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Joshua Silva | UI/UX Specialist & Frontend Developer',
  description:
    'Portfolio of Joshua Silva, a UI/UX Specialist and Frontend Developer building responsive, user-centered web experiences using React, JavaScript, modern CSS, and production CMS platforms.',
  keywords: [
    'Joshua Silva',
    'UI/UX Developer',
    'UX Engineer',
    'Frontend Developer',
    'React Developer',
    'Colorado Springs',
    'Remote Frontend Developer',
    'Next.js',
    'TypeScript',
    'Portfolio',
  ],
  authors: [{ name: 'Joshua Silva' }],
  openGraph: {
    title: 'Joshua Silva | UI/UX Specialist & Frontend Developer',
    description:
      'UI/UX Specialist and Frontend Developer building responsive, user-centered web experiences.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joshua Silva | UI/UX Specialist & Frontend Developer',
    description: 'Portfolio of a UI/UX Specialist and Frontend Developer — React, Next.js, and production CMS work.',
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
