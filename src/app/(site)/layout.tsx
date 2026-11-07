import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd, businessSchema } from '@/components/seo/JsonLd';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <a
        href='#main'
        className='sr-only z-[60] rounded-md bg-ink px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4'
      >
        Skip to main content
      </a>
      <JsonLd data={businessSchema()} />
      <Header />
      <main id='main' tabIndex={-1} className='flex-1 focus:outline-none'>
        {children}
      </main>
      <Footer />
    </div>
  );
}
