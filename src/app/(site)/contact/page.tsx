import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Clock, Mail, MapPin } from 'lucide-react';
import { InquiryForm } from '@/components/contact/InquiryForm';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Start a Project',
  description:
    'Request a free quote for website design, a redesign, a landing page, front-end fixes, or a monthly website care plan. Based in Colorado Springs, working across the U.S.',
  alternates: { canonical: '/contact' },
};

const next = [
  `I reply within ${site.responseTime} to set up a short discovery call.`,
  'We talk through your goals, content, timeline, and budget.',
  'You receive a written proposal with scope and price.',
  'Nothing is billed until you approve the proposal.',
];

export default function ContactPage() {
  return (
    <section className='bg-sky pb-24 pt-32 md:pt-40'>
      <div className='container-site grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16'>
        <div>
          <h1 className='text-h1 font-semibold'>Start a project</h1>
          <p className='mt-5 text-lead text-slate'>
            Tell me about your business and what you need. The more detail you share, the more useful my reply will be.
          </p>

          <h2 className='mt-10 font-sans text-base font-semibold'>What happens next</h2>
          <ol className='mt-4 space-y-4'>
            {next.map((n, i) => (
              <li key={n} className='flex gap-4'>
                <span aria-hidden className='grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-sm font-semibold text-white'>
                  {i + 1}
                </span>
                <span className='text-slate'>{n}</span>
              </li>
            ))}
          </ol>

          <ul className='mt-10 space-y-4 border-t border-line pt-8 text-slate'>
            <li className='flex gap-3'>
              <Mail size={20} aria-hidden className='mt-0.5 shrink-0 text-spruce' />
              <span>
                Prefer email?{' '}
                <a href={`mailto:${site.email}`} className='break-all font-semibold text-ink underline underline-offset-4'>
                  {site.email}
                </a>
              </span>
            </li>
            <li className='flex gap-3'>
              <MapPin size={20} aria-hidden className='mt-0.5 shrink-0 text-spruce' />
              <span>{site.location}, serving Fountain, Monument, Pueblo, and clients across the U.S.</span>
            </li>
            <li className='flex gap-3'>
              <Clock size={20} aria-hidden className='mt-0.5 shrink-0 text-spruce' />
              <span>{site.hours}</span>
            </li>
          </ul>
          <p className='mt-8 text-slate'>
            Have questions first?{' '}
            <Link href='/faq' className='font-semibold text-spruce underline underline-offset-4'>
              Read the FAQ
            </Link>
            .
          </p>
        </div>

        <Suspense fallback={<div className='h-[60rem] rounded-lg bg-white ring-1 ring-line' aria-hidden />}>
          <InquiryForm />
        </Suspense>
      </div>
    </section>
  );
}
