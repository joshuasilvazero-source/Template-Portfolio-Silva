import type { ReactNode } from 'react';

type SectionProps = {
  id?: string;
  tone?: 'sky' | 'white' | 'ink';
  className?: string;
  labelledBy?: string;
  children: ReactNode;
};

const tones = {
  sky: 'bg-sky text-ink',
  white: 'bg-white text-ink',
  ink: 'on-dark bg-ink text-white',
};

export function Section({ id, tone = 'sky', className = '', labelledBy, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${tones[tone]} py-20 md:py-28 ${className}`}
    >
      <div className='container-site'>{children}</div>
    </section>
  );
}

type HeaderProps = {
  id: string;
  title: string;
  intro?: ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
};

export function SectionHeader({ id, title, intro, tone = 'light', className = '' }: HeaderProps) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <h2 id={id} className='text-h2 font-semibold'>
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-lead ${tone === 'dark' ? 'text-mist' : 'text-slate'}`}>{intro}</p>
      )}
    </div>
  );
}

/** Top-of-page header for inner pages. */
export function PageHeader({ title, intro, children }: { title: string; intro: ReactNode; children?: ReactNode }) {
  return (
    <header className='border-b border-line bg-white pb-16 pt-32 md:pb-20 md:pt-40'>
      <div className='container-site'>
        <h1 className='max-w-4xl text-h1 font-semibold'>{title}</h1>
        <p className='mt-5 max-w-2xl text-lead text-slate'>{intro}</p>
        {children && <div className='mt-8 flex flex-wrap gap-3'>{children}</div>}
      </div>
    </header>
  );
}
