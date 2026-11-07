import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { FaqList } from '@/components/ui/FaqList';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd';
import { careFaqs, projectFaqs } from '@/content/faq';
import { process } from '@/content/process';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers about website design costs, timelines, payment, ownership, and monthly website maintenance plans, plus a step-by-step look at how projects work.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqSchema([...projectFaqs, ...careFaqs])} />
      <PageHeader title='Questions and answers' intro='Straight answers about cost, timelines, ownership, and care plans.'>
        <ButtonLink href='/contact'>Ask your own question</ButtonLink>
      </PageHeader>

      <section aria-labelledby='projects-faq' className='bg-sky py-20'>
        <div className='container-site max-w-3xl'>
          <h2 id='projects-faq' className='text-h2 font-semibold'>
            Website projects
          </h2>
          <div className='mt-8'>
            <FaqList items={projectFaqs} />
          </div>
          <h2 className='mt-16 text-h2 font-semibold'>Website care plans</h2>
          <div className='mt-8'>
            <FaqList items={careFaqs} />
          </div>
        </div>
      </section>

      <section id='process' aria-labelledby='process-title' className='scroll-mt-20 bg-white py-20 md:py-24'>
        <div className='container-site max-w-3xl'>
          <h2 id='process-title' className='text-h2 font-semibold'>
            How a project works, step by step
          </h2>
          <ol className='mt-10 border-l-2 border-line'>
            {process.map((step, i) => (
              <li key={step.name} className='relative pb-10 pl-10 last:pb-0'>
                <span
                  aria-hidden
                  className='absolute -left-[1.0625rem] top-0 grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-semibold text-white'
                >
                  {i + 1}
                </span>
                <h3 className='text-h3 font-semibold'>{step.name}</h3>
                <p className='mt-1 text-slate'>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
