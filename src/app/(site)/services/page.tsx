import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { services } from '@/content/services';

export const metadata: Metadata = {
  title: 'Web Design & Front-End Development Services',
  description:
    'Custom website design, website redesigns, landing pages, UI/UX design, Shopify front-end work, front-end fixes, and monthly website maintenance for small businesses in Colorado Springs and across the U.S.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title='Services'
        intro='Website design and front-end development for small businesses, local service companies, startups, and online stores. Every service has a clear scope, so you know what you are getting before work starts.'
      >
        <ButtonLink href='/contact'>Request a free quote</ButtonLink>
        <ButtonLink href='/pricing' variant='secondary'>
          See pricing
        </ButtonLink>
      </PageHeader>

      <nav aria-label='Services on this page' className='border-b border-line bg-white'>
        <ul className='container-site flex gap-2 overflow-x-auto py-4'>
          {services.map(s => (
            <li key={s.id} className='shrink-0'>
              <a href={`#${s.id}`} className='inline-flex min-h-10 items-center rounded-sm px-3 text-sm text-slate ring-1 ring-line hover:text-spruce hover:ring-spruce'>
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className='bg-sky'>
        {services.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className={`scroll-mt-24 py-16 md:py-20 ${i % 2 ? 'bg-white' : ''}`}
          >
            <div className='container-site grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20'>
              <div>
                <h2 id={`${s.id}-title`} className='text-h2 font-semibold'>
                  {s.name}
                </h2>
                <p className='mt-4 text-lead text-slate'>{s.value}</p>
                <p className='mt-6 font-display text-2xl font-semibold text-spruce'>{s.price}</p>
                <div className='mt-6 flex flex-wrap gap-3'>
                  <ButtonLink href={`/contact?service=${encodeURIComponent(s.inquiryValue)}`}>
                    {s.id === 'website-care' ? 'Ask about care plans' : `Request a quote`}
                  </ButtonLink>
                  {s.id === 'website-care' && (
                    <ButtonLink href='/maintenance' variant='secondary'>
                      Compare care plans
                    </ButtonLink>
                  )}
                </div>
              </div>
              <div>
                <h3 className='font-sans text-base font-semibold text-ink'>What you get</h3>
                <ul className='mt-4 space-y-3'>
                  {s.deliverables.map(d => (
                    <li key={d} className='flex gap-3'>
                      <Check size={18} aria-hidden className='mt-0.5 shrink-0 text-spruce' />
                      <span className='text-slate'>{d}</span>
                    </li>
                  ))}
                </ul>
                <h3 className='mt-8 font-sans text-base font-semibold text-ink'>Not included</h3>
                <p className='mt-2 leading-relaxed text-slate'>{s.limits}</p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className='border-t border-line bg-white py-14'>
        <div className='container-site max-w-3xl'>
          <h2 className='text-h3 font-semibold'>What I do not offer</h2>
          <p className='mt-3 leading-relaxed text-slate'>
            I focus on how your website looks and works for visitors. I do not build custom databases, backend APIs, login systems,
            or custom payment processing, and I do not manage servers or hosting. When a project needs these, I use established
            hosted services (like Shopify, Stripe, or a hosted form service) or can point you toward a backend specialist.{' '}
            <Link href='/faq' className='font-semibold text-spruce underline underline-offset-4'>
              Read the FAQ
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
