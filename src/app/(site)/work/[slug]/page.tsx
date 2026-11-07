import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { CaseVisual } from '@/components/work/CaseVisual';
import { CtaBand } from '@/components/ui/CtaBand';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';
import { caseStudies, getCaseStudy, DELIVERED_THROUGH } from '@/content/work';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.client} Case Study`,
    description: `${study.summary} ${DELIVERED_THROUGH}.`,
    alternates: { canonical: `/work/${study.slug}` },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex(c => c.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <article>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: study.client, path: `/work/${study.slug}` },
        ])}
      />
      <header className='border-b border-line bg-white pb-14 pt-32 md:pt-40'>
        <div className='container-site'>
          <nav aria-label='Breadcrumb' className='text-sm text-slate'>
            <ol className='flex gap-2'>
              <li>
                <Link href='/work' className='underline underline-offset-4 hover:text-spruce'>
                  Work
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current='page'>{study.client}</li>
            </ol>
          </nav>
          <p className='mt-8 text-sm font-semibold text-spruce'>{study.category}</p>
          <h1 className='mt-2 text-h1 font-semibold'>{study.client}</h1>
          <p className='mt-5 max-w-2xl text-lead text-slate'>{study.overview}</p>
          <dl className='mt-10 grid max-w-3xl gap-6 border-t border-line pt-6 sm:grid-cols-3'>
            <div>
              <dt className='text-sm text-slate'>My role</dt>
              <dd className='mt-1 font-semibold'>UI/UX and front-end</dd>
            </div>
            <div>
              <dt className='text-sm text-slate'>Context</dt>
              <dd className='mt-1 font-semibold'>{DELIVERED_THROUGH}</dd>
            </div>
            <div>
              <dt className='text-sm text-slate'>Technologies</dt>
              <dd className='mt-1 font-semibold'>{study.technologies.join(', ')}</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className='bg-sky py-16 md:py-24'>
        <div className='container-site'>
          <div className='overflow-hidden rounded-lg border border-line'>
            <CaseVisual kind={study.visual} label={`Illustration of a ${study.category.toLowerCase()} interface`} />
          </div>
          <p className='mt-3 text-sm text-slate'>Original illustration of the interface type. Not a client screenshot.</p>

          <div className='mt-16 grid gap-14 lg:grid-cols-2 lg:gap-20'>
            <section aria-labelledby='challenge'>
              <h2 id='challenge' className='text-h2 font-semibold'>
                The challenge
              </h2>
              <p className='mt-4 text-lead text-slate'>{study.challenge}</p>
            </section>
            <section aria-labelledby='responsibilities'>
              <h2 id='responsibilities' className='text-h2 font-semibold'>
                What I worked on
              </h2>
              <p className='mt-3 text-slate'>
                My contribution covered the specific interfaces below, not the whole website.
              </p>
              <ul className='mt-5 space-y-3'>
                {study.responsibilities.map(r => (
                  <li key={r} className='flex gap-3'>
                    <Check size={18} aria-hidden className='mt-0.5 shrink-0 text-spruce' />
                    <span className='text-slate'>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section aria-labelledby='improvements' className='mt-16 rounded-lg bg-white p-8 ring-1 ring-line md:p-10'>
            <h2 id='improvements' className='text-h2 font-semibold'>
              Key improvements
            </h2>
            <ul className='mt-6 grid gap-6 md:grid-cols-3'>
              {study.improvements.map(i => (
                <li key={i} className='border-t-2 border-spruce pt-4 text-lg font-medium'>
                  {i}
                </li>
              ))}
            </ul>
          </section>

          {study.link && (
            <p className='mt-8'>
              <a href={study.link.href} target='_blank' rel='noopener noreferrer' className='font-semibold text-spruce underline underline-offset-4'>
                {study.link.label}
                <span className='sr-only'> (opens in a new tab)</span>
              </a>
            </p>
          )}

          <nav aria-label='Next case study' className='mt-16 border-t border-line pt-8'>
            <Link href={`/work/${next.slug}`} className='group block'>
              <span className='text-sm text-slate'>Next case study</span>
              <span className='mt-1 block font-display text-h3 font-semibold group-hover:text-spruce'>{next.client}</span>
            </Link>
          </nav>
        </div>
      </div>

      <CtaBand title='Have an interface that needs this kind of attention?' />
    </article>
  );
}
