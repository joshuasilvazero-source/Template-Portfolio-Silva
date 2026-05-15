'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoSvg } from '@/components/Logo/LogoSvg';
import { useGameStore } from '@/utils/gameStore';

const NAV = [
  { label: 'About',      href: '#about',      code: 'A1' },
  { label: 'Skills',     href: '#skills',     code: 'A2' },
  { label: 'Projects',   href: '#projects',   code: 'A3' },
  { label: 'Experience', href: '#experience', code: 'A4' },
  { label: 'Contact',    href: '#contact',    code: 'A5' },
];

const Navbar: React.FC = () => {
  const [isOpen,     setIsOpen]     = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const { showReplayBtn, setReplayRequested } = useGameStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveHash('#' + e.target.id); });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled || isOpen
          ? 'border-b border-white/[0.07] bg-black/90 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      {/* Top accent line */}
      {scrolled && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className='absolute inset-x-0 top-0 h-px origin-left'
          style={{ background: 'linear-gradient(90deg, #00e5ff, #2dd4bf 30%, rgba(168,85,247,0.75) 65%, #818cf8, transparent)' }}
        />
      )}

      <div className='mx-auto max-w-7xl px-4 py-3.5'>
        <div className='flex items-center justify-between'>

          {/* ── Logo ── */}
          <motion.a
            href='#home'
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='group flex items-center gap-2.5'
          >
            <div
              className='rounded-lg p-1.5 transition-all duration-300 group-hover:bg-cyan-400/10'
              style={{ border: '1px solid rgba(0,229,255,0.15)' }}
            >
              <LogoSvg size={26} />
            </div>
            <div className='hidden flex-col sm:flex'>
              <span className='font-mono text-sm font-bold leading-tight text-white'>Joshua Silva</span>
              <span className='font-mono text-[10px] leading-tight text-cyan-400/55 tracking-wider'>
                Software Engineer
              </span>
            </div>
          </motion.a>

          {/* ── Desktop nav ── */}
          <div className='hidden items-center gap-0.5 md:flex'>
            {NAV.map((item, i) => {
              const active = activeHash === item.href;
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                  className={`group relative rounded-md px-4 py-2 font-mono text-sm transition-all duration-200 ${
                    active
                      ? 'text-cyan-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {/* Active underline */}
                  {active && (
                    <motion.div
                      layoutId='nav-indicator'
                      className='absolute inset-0 rounded-md bg-cyan-400/8'
                    />
                  )}

                  {/* Hover bg */}
                  <span
                    className='absolute inset-0 rounded-md opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  />

                  <span className='relative z-10'>{item.label}</span>

                  {/* Mission code tooltip */}
                  <span
                    className='absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[7px] uppercase tracking-widest text-cyan-400/30 opacity-0 transition-opacity group-hover:opacity-100'
                  >
                    {item.code}
                  </span>
                </motion.a>
              );
            })}

            {/* Hire Me */}
            <motion.a
              href='#contact'
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className='ml-3 rounded-lg px-4 py-2 font-mono text-sm font-bold text-black transition-all'
              style={{
                background: 'linear-gradient(135deg, #00e5ff, #0ea5e9)',
                boxShadow: '0 0 20px rgba(0,229,255,0.25)',
              }}
            >
              Hire Me
            </motion.a>

            {/* Replay Game — only shown after winning */}
            <AnimatePresence>
              {showReplayBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setReplayRequested(true)}
                  title='Replay Game'
                  className='group relative ml-1.5 flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/8 text-cyan-400 transition-all duration-200 hover:border-cyan-400/50 hover:bg-cyan-400/15'
                >
                  <svg className='h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                  </svg>
                  {/* Tooltip */}
                  <span className='pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100'>
                    Replay
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setIsOpen(v => !v)}
            aria-label='Toggle menu'
            aria-expanded={isOpen}
            className='rounded-lg border border-white/8 p-2 text-gray-400 transition-all hover:border-white/15 hover:text-white md:hidden'
          >
            <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className='overflow-hidden md:hidden'
            >
              <div className='mt-3 space-y-1 border-t border-white/8 pt-3 pb-2'>
                {NAV.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      const id = item.href.replace('#', '');
                      setTimeout(() => {
                        const el = document.getElementById(id);
                        if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
                      }, 280);
                    }}
                    className={`flex items-center justify-between rounded-md px-4 py-2.5 font-mono text-sm transition-colors ${
                      activeHash === item.href
                        ? 'bg-cyan-400/8 text-cyan-400'
                        : 'text-gray-400 hover:bg-white/4 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span className='font-mono text-[9px] tracking-widest text-gray-600'>
                      {item.code}
                    </span>
                  </a>
                ))}
                <a
                  href='#contact'
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    setTimeout(() => {
                      const el = document.getElementById('contact');
                      if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
                    }, 280);
                  }}
                  className='mt-2 block rounded-lg py-2.5 text-center font-mono text-sm font-bold text-black'
                  style={{ background: 'linear-gradient(135deg, #00e5ff, #0ea5e9)' }}
                >
                  Hire Me
                </a>

                {showReplayBtn && (
                  <button
                    onClick={() => { setReplayRequested(true); setIsOpen(false); }}
                    className='mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/20 py-2.5 font-mono text-sm text-cyan-400 transition-colors hover:bg-cyan-400/8'
                  >
                    <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                    </svg>
                    Replay Game
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
