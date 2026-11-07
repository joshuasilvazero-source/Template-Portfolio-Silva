import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';
import { site } from '@/content/site';
import { Contour } from './Contour';

export function Hero() {
  return (
    <section aria-labelledby='hero-title' className='relative overflow-hidden bg-white pt-17'>
      <div className='container-site grid gap-12 py-14 md:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-16 lg:py-24'>
        <div className='relative z-10'>
          <p className='text-[0.9375rem] font-medium text-slate'>
            Freelance web designer and U.S. Army veteran in {site.location}
          </p>
          <h1 id='hero-title' className='mt-5 text-display font-semibold text-ink'>
            Websites for local businesses, built by the person who answers your email.
          </h1>
          <p className='mt-6 max-w-xl text-lead text-slate'>
            Custom design, front-end development, and monthly website care for small businesses in Colorado Springs,
            Fountain, and across the U.S. Your domain, hosting, and finished site stay in your name.
          </p>
          <div className='mt-9 flex flex-wrap gap-3'>
            <ButtonLink href='/contact'>Start a project</ButtonLink>
            <ButtonLink href='/work' variant='secondary'>
              View my work
            </ButtonLink>
          </div>
          <p className='mt-10 max-w-lg border-l-2 border-spruce pl-4 text-[0.9375rem] leading-relaxed text-slate'>
            Professional UI/UX and front-end experience on real e-commerce and B2B storefronts, including BusesForSale.com,
            Lovato Electric, and Jackson Pottery.
          </p>
        </div>

        <div className='relative mx-auto w-full max-w-md lg:max-w-none'>
          <Contour className='pointer-events-none absolute left-[-45%] top-[-22%] h-[144%] w-[190%] text-spruce mask-[radial-gradient(closest-side,#000_55%,transparent_100%)]' />
          <div className='relative aspect-4/5 overflow-hidden rounded-xl bg-ink shadow-[0_30px_60px_-30px_rgba(27,36,48,0.55)]'>
            <Image
              src='/images/hero/profile.jpg'
              alt={`${site.name}, web designer and front-end developer`}
              fill
              priority
              sizes='(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 100vw'
              className='object-cover object-top mask-[radial-gradient(ellipse_62%_58%_at_50%_42%,#000_58%,transparent_100%)]'
            />
            <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/80 to-transparent p-6 pt-16 text-white'>
              <p className='font-display text-xl font-semibold'>{site.name}</p>
              <p className='text-sm text-mist'>U.S. Army veteran, UI/UX and front-end developer</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
