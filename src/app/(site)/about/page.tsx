import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { CtaBand } from '@/components/ui/CtaBand';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'About Joshua Silva',
  description:
    'Joshua Silva is a freelance web designer and front-end developer in Colorado Springs and a U.S. Army veteran, with professional UI/UX experience on e-commerce and B2B websites.',
  alternates: { canonical: '/about' },
};

const tools = [
  'HTML5 and CSS3',
  'JavaScript',
  'React and Vite',
  'Tailwind CSS',
  'Framer Motion',
  'Figma',
  'Shopify front-end',
  'WordPress front-end',
  'Git and GitHub',
  'Vercel',
];

const principles = [
  {
    title: 'Clarity before decoration',
    body: 'Visitors should understand what you do and how to reach you within seconds. Visual polish supports that — it never gets in the way.',
  },
  {
    title: 'Small screens first',
    body: 'I design for phones first and test on real devices, because that is where most of your customers will meet your business.',
  },
  {
    title: 'Methodical troubleshooting',
    body: 'Years of diagnosing complex mechanical and electrical systems in the Army taught me to find root causes instead of patching symptoms.',
  },
  {
    title: 'Straight answers',
    body: 'Clear scope, honest timelines, and a plain explanation when something is outside what I do.',
  },
];

export default function AboutPage() {
  return (
    <>
      <header className='bg-white pb-16 pt-32 md:pb-24 md:pt-40'>
        <div className='container-site grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-20'>
          <div>
            <h1 className='text-h1 font-semibold'>Hi, I’m Joshua. I design and build websites for small businesses.</h1>
            <div className='mt-6 max-w-2xl space-y-4 text-lead text-slate'>
              <p>
                I am a web designer and front-end developer based in {site.location}. I help small businesses, local service
                companies, and independent professionals look credible online and make it easy for customers to get in touch.
              </p>
              <p>
                My professional UI/UX work has focused on real, live websites: improving product cards, mobile search, category
                pages, navigation, and checkout screens for e-commerce and B2B clients. That is the same care I bring to every
                small business site.
              </p>
            </div>
            <div className='mt-8 flex flex-wrap gap-3'>
              <ButtonLink href='/contact'>Start a project</ButtonLink>
              <ButtonLink href='/work' variant='secondary'>
                See my work
              </ButtonLink>
            </div>
          </div>
          <div className='relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-xl bg-ink'>
            <Image
              src='/images/hero/profile.jpg'
              alt={`Portrait of ${site.name}`}
              fill
              sizes='(min-width: 1024px) 24rem, 90vw'
              className='object-cover object-top'
            />
          </div>
        </div>
      </header>

      <section aria-labelledby='background' className='bg-sky py-20 md:py-24'>
        <div className='container-site grid gap-12 lg:grid-cols-2 lg:gap-20'>
          <div>
            <h2 id='background' className='text-h2 font-semibold'>
              Background
            </h2>
            <div className='prose-site mt-6'>
              <p>
                As a UI/UX Specialist at FocusPoint, I translate client requirements and mockups into responsive interfaces and
                fix front-end problems on production sites — layout bugs, overflow and scrolling issues, grid behavior,
                pagination, and mobile display. Clients have included BusesForSale.com, Lovato Electric, Jackson Pottery,
                TotalWorkWear, and iSlides.
              </p>
              <p>
                Before moving into web development, I served in the U.S. Army as a Wheeled Vehicle Mechanic and later as a
                Sergeant, leading and training soldiers in deadline-driven work. That experience shapes how I run projects: clear
                priorities, accountability, and following through on what I commit to.
              </p>
              <p>
                I studied at the University of Central Bayamón, where laboratory science and research methods gave me a
                systematic approach to problem-solving.
              </p>
            </div>
          </div>
          <div>
            <h2 className='text-h2 font-semibold'>Tools I use</h2>
            <ul className='mt-6 flex flex-wrap gap-2'>
              {tools.map(t => (
                <li key={t} className='rounded-sm bg-white px-3 py-1.5 text-slate ring-1 ring-line'>
                  {t}
                </li>
              ))}
            </ul>
            <p className='mt-6 text-slate'>
              I focus on the front end — what your visitors see and use. For hosting, payments, and forms I rely on established
              services like Vercel, Stripe, and Shopify rather than custom backend systems.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby='how-i-work' className='bg-white py-20 md:py-24'>
        <div className='container-site'>
          <h2 id='how-i-work' className='text-h2 font-semibold'>
            How I work
          </h2>
          <dl className='mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2'>
            {principles.map(p => (
              <div key={p.title} className='border-t-2 border-ink pt-5'>
                <dt className='font-display text-h3 font-semibold'>{p.title}</dt>
                <dd className='mt-2 leading-relaxed text-slate'>{p.body}</dd>
              </div>
            ))}
          </dl>
          <p className='mt-12 text-slate'>
            Based in {site.location}, working with clients in {site.serviceArea.slice(0, -1).join(', ')}, and{' '}
            {site.serviceArea.at(-1)?.toLowerCase()}.{' '}
            <Link href='/services' className='font-semibold text-spruce underline underline-offset-4'>
              See services
            </Link>
            .
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
