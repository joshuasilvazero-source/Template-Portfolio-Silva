import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { Section, SectionHeader } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { WorkRow } from '@/components/work/WorkCard';
import { PlanCards } from '@/components/care/PlanCards';
import { services } from '@/content/services';
import { caseStudies } from '@/content/work';
import { processShort } from '@/content/process';
import { allowanceNote } from '@/content/maintenance';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const primaryServiceIds = ['custom-website-design', 'website-redesign', 'landing-pages', 'front-end-fixes'];

// Promises a visitor can check, not adjectives. Keep each one true and verifiable.
const reasons = [
  {
    title: 'You own everything',
    body: 'Your domain and hosting are registered in your name from day one, and the finished site is yours after the final payment. If you ever leave, nothing leaves with me.',
  },
  {
    title: 'Care time in minutes, not promises',
    body: 'Every care plan states exactly how much editing time you get each month. Anything beyond it is quoted at $40/hour and only done with your approval.',
  },
  {
    title: 'Accessible from the start',
    body: 'Layouts are built to WCAG 2.2 AA guidelines: readable contrast, full keyboard use, and proper labels for screen readers — on phones first, then larger screens.',
  },
  {
    title: 'The builder is the person you talk to',
    body: 'No account managers or sales calls. I have shipped interface work on live e-commerce and B2B storefronts, and I answer every email myself.',
  },
];

export default function Home() {
  const featured = caseStudies.filter(c => c.featured).slice(0, 2);
  const primary = services.filter(s => primaryServiceIds.includes(s.id));

  return (
    <>
      <Hero />

      {/* Services overview */}
      <Section labelledBy='services-title'>
        <div className='grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20'>
          <div>
            <SectionHeader
              id='services-title'
              title='What I can do for your business'
              intro='From a brand-new website to fixing the one you have, every project is designed around what your customers need to see and do.'
            />
            <ButtonLink href='/services' variant='secondary' className='mt-8'>
              Explore services
            </ButtonLink>
          </div>
          <ul className='divide-y divide-line border-y border-line'>
            {primary.map(s => (
              <li key={s.id}>
                <Link
                  href={`/services#${s.id}`}
                  className='group grid gap-2 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8'
                >
                  <span>
                    <span className='block font-display text-h3 font-semibold group-hover:text-spruce'>{s.name}</span>
                    <span className='mt-1 block text-slate'>{s.short}</span>
                  </span>
                  <span className='text-[0.9375rem] font-semibold text-spruce'>{s.price}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Featured work */}
      <Section tone='white' labelledBy='work-title'>
        <div className='flex flex-wrap items-end justify-between gap-6'>
          <SectionHeader
            id='work-title'
            title='Recent work'
            intro='Front-end and UI/UX improvements delivered for e-commerce and B2B clients through FocusPoint.'
          />
          <ButtonLink href='/work' variant='secondary'>
            View all work
          </ButtonLink>
        </div>
        <div className='mt-14 space-y-20'>
          {featured.map((study, i) => (
            <WorkRow key={study.slug} study={study} reverse={i % 2 === 1} />
          ))}
        </div>
      </Section>

      {/* Care plans preview + bundle */}
      <Section labelledBy='care-title'>
        <SectionHeader
          id='care-title'
          title='Monthly website care'
          intro={`Keep your site current without hunting for help every time something changes. ${allowanceNote}`}
        />
        <div className='mt-12'>
          <PlanCards mode='preview' />
        </div>
        <div className='mt-12 grid gap-6 rounded-lg bg-white p-7 ring-1 ring-line md:grid-cols-[1fr_auto] md:items-center md:p-10'>
          <div>
            <h3 className='text-h3 font-semibold'>New website + ongoing care</h3>
            <p className='mt-2 max-w-2xl text-slate'>
              Launch your new site, then add a care plan so the same person who built it keeps it current. The website project
              and the monthly plan are priced separately — the plan never includes the cost of the initial build.
            </p>
          </div>
          <ButtonLink href='/maintenance' variant='primary'>
            Compare care plans
          </ButtonLink>
        </div>
      </Section>

      {/* Why work with me */}
      <Section tone='white' labelledBy='why-title'>
        <SectionHeader id='why-title' title='Why work with me' />
        <dl className='mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2'>
          {reasons.map(r => (
            <div key={r.title} className='border-t-2 border-ink pt-5'>
              <dt className='font-display text-h3 font-semibold'>{r.title}</dt>
              <dd className='mt-2 leading-relaxed text-slate'>{r.body}</dd>
            </div>
          ))}
        </dl>
        <Link href='/about' className='mt-10 inline-flex min-h-11 items-center font-semibold text-spruce underline underline-offset-4'>
          More about me
        </Link>
      </Section>

      {/* Process */}
      <Section labelledBy='process-title'>
        <SectionHeader
          id='process-title'
          title='How a project works'
          intro='A simple, predictable process so you always know what happens next.'
        />
        <ol className='mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          {processShort.map((step, i) => (
            <li key={step.name}>
              <span className='font-display text-4xl font-semibold text-spruce' aria-hidden>
                {i + 1}
              </span>
              <h3 className='mt-3 text-h3 font-semibold'>{step.name}</h3>
              <p className='mt-2 text-slate'>{step.body}</p>
            </li>
          ))}
        </ol>
        <Link href='/faq#process' className='mt-10 inline-flex min-h-11 items-center font-semibold text-spruce underline underline-offset-4'>
          See every step in detail
        </Link>
      </Section>

      <CtaBand />
    </>
  );
}
