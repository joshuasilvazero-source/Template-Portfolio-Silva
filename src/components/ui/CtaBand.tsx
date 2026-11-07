import { ButtonLink } from './Button';
import { site } from '@/content/site';

type Props = {
  title?: string;
  body?: string;
  secondary?: { label: string; href: string };
};

export function CtaBand({
  title = 'Ready to talk about your website?',
  body = `Send a few details about your project. I reply within ${site.responseTime} with next steps — no pressure, no obligation.`,
  secondary = { label: 'Compare care plans', href: '/maintenance' },
}: Props) {
  return (
    <section aria-labelledby='cta-title' className='on-dark bg-ink py-20 text-white md:py-24'>
      <div className='container-site grid items-end gap-8 md:grid-cols-[1fr_auto]'>
        <div className='max-w-2xl'>
          <h2 id='cta-title' className='text-h2 font-semibold'>
            {title}
          </h2>
          <p className='mt-4 text-lead text-mist'>{body}</p>
        </div>
        <div className='flex flex-wrap gap-3'>
          <ButtonLink href='/contact' variant='light'>
            Start a project
          </ButtonLink>
          <ButtonLink href={secondary.href} variant='outline-light'>
            {secondary.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
