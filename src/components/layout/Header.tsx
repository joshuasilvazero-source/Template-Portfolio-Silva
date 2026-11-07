'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { nav, site } from '@/content/site';
import { buttonClass } from '@/components/ui/Button';
import { Monogram } from './Monogram';

export function Header() {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so it closes itself on navigation.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOn(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-md'>
      <div className='container-site flex h-[4.25rem] items-center justify-between gap-6'>
        <Link href='/' className='flex items-center gap-3' aria-label={`${site.businessName}, home`}>
          <Monogram />
          <span className='leading-tight'>
            <span className='block font-display text-[1.05rem] font-semibold'>{site.name}</span>
            <span className='hidden text-xs text-slate sm:block'>{site.tagline}</span>
          </span>
        </Link>

        <nav aria-label='Main' className='hidden lg:block'>
          <ul className='flex items-center gap-1'>
            {nav.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`rounded-md px-3 py-2 text-[0.9375rem] transition-colors hover:text-spruce ${
                    isActive(item.href) ? 'font-semibold text-spruce' : 'text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='flex items-center gap-2'>
          <span className='hidden sm:block'>
            <Link href='/contact' className={buttonClass('primary', 'min-h-10')}>
              Start a project
            </Link>
          </span>
          <button
            type='button'
            className='grid h-11 w-11 place-items-center rounded-md border border-line lg:hidden'
            aria-expanded={open}
            aria-controls='mobile-nav'
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      <nav
        id='mobile-nav'
        aria-label='Mobile'
        hidden={!open}
        className='max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-line bg-white lg:hidden'
      >
        <ul className='container-site py-4'>
          {[...nav, { label: 'Contact', href: '/contact' }].map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`block border-b border-line py-4 text-lg ${
                  isActive(item.href) ? 'font-semibold text-spruce' : 'text-ink'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className='pt-5'>
            <Link href='/contact' className={buttonClass('primary', 'w-full')}>
              Start a project
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
