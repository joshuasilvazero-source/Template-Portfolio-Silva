import Link from 'next/link';
import type { CaseStudy } from '@/content/work';
import { CaseVisual } from './CaseVisual';

/** Editorial row: illustration on one side, summary on the other. */
export function WorkRow({ study, reverse = false, headingLevel = 3 }: { study: CaseStudy; reverse?: boolean; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article className='grid items-center gap-8 md:grid-cols-2 md:gap-14'>
      <div className={`overflow-hidden rounded-lg border border-line ${reverse ? 'md:order-2' : ''}`}>
        <CaseVisual kind={study.visual} label={`Illustration of a ${study.category.toLowerCase()} interface`} />
      </div>
      <div>
        <p className='text-sm font-semibold text-spruce'>{study.category}</p>
        <H className='mt-2 text-h2 font-semibold'>{study.client}</H>
        <p className='mt-4 text-lead text-slate'>{study.summary}</p>
        <ul className='mt-5 flex flex-wrap gap-2' aria-label='Technologies'>
          {study.technologies.map(t => (
            <li key={t} className='rounded-sm bg-white px-2.5 py-1 text-sm text-slate ring-1 ring-line'>
              {t}
            </li>
          ))}
        </ul>
        <Link
          href={`/work/${study.slug}`}
          className='mt-7 inline-flex min-h-11 items-center font-semibold text-spruce underline decoration-spruce/30 underline-offset-4 hover:decoration-spruce'
        >
          Read the {study.client} case study
        </Link>
      </div>
    </article>
  );
}

/** Compact card for secondary projects. */
export function WorkCard({ study }: { study: CaseStudy }) {
  return (
    <article className='group relative flex flex-col overflow-hidden rounded-lg border border-line bg-white'>
      <CaseVisual kind={study.visual} label={`Illustration of a ${study.category.toLowerCase()} interface`} />
      <div className='flex flex-1 flex-col border-t border-line p-6'>
        <p className='text-sm font-semibold text-spruce'>{study.category}</p>
        <h3 className='mt-1 text-h3 font-semibold'>
          <Link href={`/work/${study.slug}`} className='after:absolute after:inset-0 group-hover:text-spruce'>
            {study.client}
          </Link>
        </h3>
        <p className='mt-2 text-slate'>{study.summary}</p>
      </div>
    </article>
  );
}
