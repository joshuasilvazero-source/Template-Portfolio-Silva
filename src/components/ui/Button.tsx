import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'light' | 'outline-light';

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-[0.9375rem] font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-spruce text-white hover:bg-spruce-deep',
  secondary: 'border border-ink/20 bg-white text-ink hover:border-ink/40',
  light: 'bg-white text-ink hover:bg-sky',
  'outline-light': 'border border-white/30 text-white hover:border-white/60',
};

export const buttonClass = (variant: Variant = 'primary', extra = '') =>
  `${base} ${variants[variant]} ${extra}`;

type LinkProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ variant = 'primary', className = '', children, ...props }: LinkProps) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      {children}
    </Link>
  );
}
