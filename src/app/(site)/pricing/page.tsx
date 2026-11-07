import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { notIncluded, paymentTerms, pricingFactors, projectPricing } from '@/content/pricing';
import { plans } from '@/content/maintenance';

export const metadata: Metadata = {
  title: 'Website Design Pricing',
  description:
    'Transparent starting prices for small business websites ($1,000–$2,000), landing pages ($400–$800), website redesigns ($800–$2,500), and front-end fixes (from $40/hour).',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        title='Pricing'
        intro='Starting price ranges so you can plan your budget. Every project gets a written proposal with a final price before any work begins.'
      >
        <ButtonLink href='/contact'>Request a quote</ButtonLink>
        <ButtonLink href='/maintenance' variant='secondary'>
          Monthly care plans
        </ButtonLink>
      </PageHeader>

      <section aria-labelledby='project-pricing' className='bg-sky py-20 md:py-24'>
        <div className='container-site'>
          <h2 id='project-pricing' className='sr-only'>
            One-time projects
          </h2>
          <ul className='grid gap-6 md:grid-cols-2'>
            {projectPricing.map(p => (
              <li key={p.id} className='flex flex-col rounded-lg bg-white p-7 ring-1 ring-line md:p-8'>
                <h3 className='text-h3 font-semibold'>{p.name}</h3>
                <p className='mt-1 text-slate'>{p.summary}</p>
                <p className='mt-5 font-display text-4xl font-semibold tracking-tight'>{p.price}</p>
                <ul className='mt-6 flex-1 space-y-3'>
                  {p.includes.map(item => (
                    <li key={item} className='flex gap-3'>
                      <Check size={18} aria-hidden className='mt-0.5 shrink-0 text-spruce' />
                      <span className='text-slate'>{item}</span>
                    </li>
                  ))}
                </ul>
                <ButtonLink href={`/contact?service=${encodeURIComponent(p.serviceValue)}`} variant='secondary' className='mt-8 self-start'>
                  Request a quote for a {p.name.toLowerCase()}
                </ButtonLink>
              </li>
            ))}
          </ul>

          <p className='mt-8 max-w-3xl rounded-md bg-amber-tint p-5 leading-relaxed text-amber-ink'>
            <strong>These are starting ranges, not binding quotes.</strong> Your final price depends on project scope, complexity,
            integrations, how ready your content is, and the number of revisions. You will always see and approve the price in a
            written proposal first.
          </p>
        </div>
      </section>

      <section aria-labelledby='terms-title' className='bg-white py-20 md:py-24'>
        <div className='container-site grid gap-14 lg:grid-cols-3'>
          <div>
            <h2 id='terms-title' className='text-h3 font-semibold'>
              How payment works
            </h2>
            <ul className='mt-4 space-y-3 text-slate'>
              <li>{paymentTerms.deposit}.</li>
              <li>{paymentTerms.final}.</li>
              <li>{paymentTerms.revisions}.</li>
              <li>Additional revisions and out-of-scope changes are quoted first, typically at {paymentTerms.hourlyRate}.</li>
              <li>
                Your domain and hosting are in your name from the start, and the finished site is yours after the final
                payment. No lock-in.
              </li>
            </ul>
            <p className='mt-4 text-sm text-slate'>Exact terms are set in your signed project agreement.</p>
          </div>
          <div>
            <h2 className='text-h3 font-semibold'>What affects the price</h2>
            <ul className='mt-4 list-disc space-y-2 pl-5 text-slate'>
              {pricingFactors.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className='text-h3 font-semibold'>Not included in project prices</h2>
            <ul className='mt-4 list-disc space-y-2 pl-5 text-slate'>
              {notIncluded.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby='care-pricing' className='bg-sky py-20'>
        <div className='container-site grid gap-8 md:grid-cols-[1fr_auto] md:items-center'>
          <div>
            <h2 id='care-pricing' className='text-h2 font-semibold'>
              Monthly website care
            </h2>
            <p className='mt-3 max-w-2xl text-lead text-slate'>
              {plans.map(p => `${p.name} $${p.price}/month`).join(', ')}. Billed monthly through Stripe, cancel any time.
              Care plans are separate from project pricing.
            </p>
          </div>
          <ButtonLink href='/maintenance'>Compare care plans</ButtonLink>
        </div>
      </section>

      <section className='bg-white py-12'>
        <p className='container-site text-slate'>
          Have more questions about cost?{' '}
          <Link href='/faq' className='font-semibold text-spruce underline underline-offset-4'>
            Read the FAQ
          </Link>
          .
        </p>
      </section>

      <CtaBand title='Get a quote for your project' />
    </>
  );
}
