import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { FaqList } from '@/components/ui/FaqList';
import { PlanCards } from '@/components/care/PlanCards';
import { ComparisonTable } from '@/components/care/ComparisonTable';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd';
import { allowanceNote, planTerms } from '@/content/maintenance';
import { careFaqs } from '@/content/faq';
import { billing, site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Website Maintenance Plans',
  description:
    'Monthly website care plans from $79/month: visual checks, broken-link checks, content edits, and front-end fixes for small business websites. Clear editing allowances, cancel any time.',
  alternates: { canonical: '/maintenance' },
};

const steps = [
  { name: 'Choose a plan', body: 'Pick the plan that fits how often your site changes.' },
  { name: 'Subscribe securely', body: 'Checkout is hosted by Stripe. You get a receipt by email.' },
  { name: 'Onboarding', body: `I contact you within ${site.responseTime} to confirm access to your site and how to send requests.` },
  { name: 'Monthly care', body: 'Send requests by email. Each month you get a check-up and a written summary or report.' },
];

export default function MaintenancePage() {
  return (
    <>
      <JsonLd data={faqSchema(careFaqs)} />
      <PageHeader
        title='Website care plans'
        intro='A flat monthly fee for regular checks, content edits, and front-end fixes, so your site stays current without the hassle of finding help every time.'
      >
        <ButtonLink href='#plans'>See plans</ButtonLink>
        <ButtonLink href='#compare' variant='secondary'>
          Compare plans
        </ButtonLink>
      </PageHeader>

      <section id='plans' aria-labelledby='plans-title' className='scroll-mt-20 bg-sky py-20 md:py-24'>
        <div className='container-site'>
          <h2 id='plans-title' className='text-h2 font-semibold'>
            Choose a plan
          </h2>
          <p className='mt-3 max-w-2xl text-lead text-slate'>{allowanceNote}</p>
          <div className='mt-12'>
            <PlanCards />
          </div>
          {billing.customerPortal && (
            <p className='mt-8 text-slate'>
              Already subscribed?{' '}
              <a href={billing.customerPortal} className='font-semibold text-spruce underline underline-offset-4'>
                Manage billing, update your card, or cancel
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <section id='compare' aria-labelledby='compare-title' className='scroll-mt-20 bg-white py-20 md:py-24'>
        <div className='container-site'>
          <h2 id='compare-title' className='text-h2 font-semibold'>
            Compare plans
          </h2>
          <div className='mt-10'>
            <ComparisonTable />
          </div>
        </div>
      </section>

      <section aria-labelledby='how-title' className='bg-sky py-20'>
        <div className='container-site'>
          <h2 id='how-title' className='text-h2 font-semibold'>
            How it works
          </h2>
          <ol className='mt-10 grid gap-8 md:grid-cols-4'>
            {steps.map((s, i) => (
              <li key={s.name}>
                <span aria-hidden className='font-display text-3xl font-semibold text-spruce'>
                  {i + 1}
                </span>
                <h3 className='mt-2 text-h3 font-semibold'>{s.name}</h3>
                <p className='mt-2 text-slate'>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby='bundle-title' className='on-dark bg-ink py-20 text-white'>
        <div className='container-site grid gap-10 lg:grid-cols-2 lg:gap-20'>
          <div>
            <h2 id='bundle-title' className='text-h2 font-semibold'>
              New website + ongoing care
            </h2>
            <p className='mt-4 text-lead text-mist'>
              Planning a new site? Have it designed and built, then enroll in a care plan after launch. The website project is
              quoted and paid separately — monthly plans never include the cost of building the site.
            </p>
            <ButtonLink href={`/contact?service=${encodeURIComponent('Small business website')}`} variant='light' className='mt-8'>
              Start a website project
            </ButtonLink>
          </div>
          <ul className='space-y-4 text-mist'>
            {[
              'One person for the design and the ongoing updates',
              'A defined amount of support every month',
              'Predictable, flat monthly cost',
              'A simple way to request changes: just email',
              'Consistent design as your site grows',
            ].map(b => (
              <li key={b} className='border-b border-line-dark pb-4'>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id='plan-terms' aria-labelledby='terms-title' className='scroll-mt-20 bg-white py-20 md:py-24'>
        <div className='container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20'>
          <div>
            <h2 id='terms-title' className='text-h2 font-semibold'>
              Plan terms
            </h2>
            <p className='mt-4 text-slate'>
              Please read these before subscribing. By continuing to checkout you confirm you understand what each plan covers.
            </p>
          </div>
          <ul className='space-y-4'>
            {planTerms.map(t => (
              <li key={t} className='border-l-2 border-line pl-4 leading-relaxed text-slate'>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby='care-faq' className='bg-sky py-20'>
        <div className='container-site max-w-3xl'>
          <h2 id='care-faq' className='text-h2 font-semibold'>
            Care plan questions
          </h2>
          <div className='mt-8'>
            <FaqList items={careFaqs} />
          </div>
        </div>
      </section>

      <CtaBand
        title='Not sure which plan fits?'
        body='Tell me about your site and how often it changes, and I will recommend a plan — or tell you if you do not need one.'
        secondary={{ label: 'See project pricing', href: '/pricing' }}
      />
    </>
  );
}
