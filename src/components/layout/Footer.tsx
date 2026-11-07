import Link from 'next/link';
import { billing, nav, site } from '@/content/site';
import { Monogram } from './Monogram';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='on-dark border-t border-line-dark bg-ink text-mist'>
      <div className='container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]'>
        <div className='max-w-sm'>
          <div className='flex items-center gap-3 text-white'>
            <Monogram light />
            <span className='font-display text-lg font-semibold'>{site.businessName}</span>
          </div>
          <p className='mt-5 leading-relaxed'>
            Website design, front-end development, and monthly website care for small businesses in{' '}
            {site.location} and across the U.S.
          </p>
          <p className='mt-4 text-sm'>Business hours: {site.hours}</p>
        </div>

        <nav aria-label='Footer'>
          <h2 className='font-sans text-sm font-semibold text-white'>Site</h2>
          <ul className='mt-4 space-y-3'>
            {[...nav, { label: 'FAQ', href: '/faq' }, { label: 'Contact', href: '/contact' }].map(item => (
              <li key={item.href}>
                <Link href={item.href} className='hover:text-white'>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className='font-sans text-sm font-semibold text-white'>Get in touch</h2>
          <ul className='mt-4 space-y-3'>
            <li>
              <a href={`mailto:${site.email}`} className='break-all hover:text-white'>
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.social.linkedin} target='_blank' rel='noopener noreferrer' className='hover:text-white'>
                LinkedIn<span className='sr-only'> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={site.social.github} target='_blank' rel='noopener noreferrer' className='hover:text-white'>
                GitHub<span className='sr-only'> (opens in a new tab)</span>
              </a>
            </li>
            {billing.customerPortal && (
              <li>
                <a href={billing.customerPortal} className='hover:text-white'>
                  Manage your care plan
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className='border-t border-line-dark'>
        <div className='container-site flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between'>
          <p>
            © {year} {site.name}. Independent freelance practice.
          </p>
          <ul className='flex gap-5'>
            <li>
              <Link href='/privacy' className='hover:text-white'>
                Privacy
              </Link>
            </li>
            <li>
              <Link href='/terms' className='hover:text-white'>
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
