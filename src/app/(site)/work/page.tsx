import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/Section';
import { CtaBand } from '@/components/ui/CtaBand';
import { WorkCard, WorkRow } from '@/components/work/WorkCard';
import { caseStudies, DELIVERED_THROUGH } from '@/content/work';

export const metadata: Metadata = {
  title: 'Work & Case Studies',
  description:
    'Front-end and UI/UX case studies: responsive improvements, e-commerce product interfaces, and B2B storefront work for BusesForSale.com, Lovato Electric, Jackson Pottery, and more.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  const featured = caseStudies.filter(c => c.featured);
  const more = caseStudies.filter(c => !c.featured);
  return (
    <>
      <PageHeader
        title='Work'
        intro={`Front-end and UI/UX improvements for e-commerce and B2B websites. ${DELIVERED_THROUGH}, working on specific interfaces and components within each client’s existing site.`}
      />

      <section aria-label='Featured case studies' className='bg-sky py-20 md:py-28'>
        <div className='container-site space-y-24'>
          {featured.map((study, i) => (
            <WorkRow key={study.slug} study={study} reverse={i % 2 === 1} headingLevel={2} />
          ))}
        </div>
      </section>

      {more.length > 0 && (
        <section aria-labelledby='more-work' className='bg-white py-20'>
          <div className='container-site'>
            <h2 id='more-work' className='text-h2 font-semibold'>
              More client work
            </h2>
            <ul className='mt-10 grid gap-6 md:grid-cols-2'>
              {more.map(study => (
                <li key={study.slug} className='flex'>
                  <WorkCard study={study} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className='border-t border-line bg-white py-10'>
        <p className='container-site max-w-3xl text-sm leading-relaxed text-slate'>
          Illustrations on this page are original drawings of the type of interface involved. They are not screenshots and do not
          show client code or branding. Client names are listed to describe work experience and do not imply endorsement.
        </p>
      </section>

      <CtaBand title='Want this kind of care on your website?' />
    </>
  );
}
