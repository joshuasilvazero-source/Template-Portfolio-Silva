import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className='bg-white pb-24 pt-32 md:pt-40'>
      <div className='container-site max-w-2xl'>
        <p className='font-display text-6xl font-semibold text-spruce'>404</p>
        <h1 className='mt-4 text-h1 font-semibold'>This page does not exist.</h1>
        <p className='mt-4 text-lead text-slate'>The link may be old or mistyped. Try one of these instead.</p>
        <div className='mt-8 flex flex-wrap gap-3'>
          <ButtonLink href='/'>Go to the home page</ButtonLink>
          <ButtonLink href='/services' variant='secondary'>
            Services
          </ButtonLink>
          <ButtonLink href='/contact' variant='secondary'>
            Contact
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
