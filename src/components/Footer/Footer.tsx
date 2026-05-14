'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LogoSvg } from '@/components/Logo/LogoSvg';

const NAV_LINKS = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
];

const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com/joshuasilvazero',       accent: 'hover:text-indigo-400' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/joshuasilvacolon', accent: 'hover:text-teal-400'   },
  { label: 'Email',    href: 'mailto:joshuasilvazero@gmail.com',         accent: 'hover:text-cyan-400'   },
];

const COORDS = 'SECTOR 7-G · COORDS 28.5°N 81.4°W · EARTH SECTOR';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='relative border-t border-white/[0.07] bg-black/50 px-4 pt-14 pb-8 backdrop-blur-md'>
      {/* Top glow line */}
      <div
        aria-hidden
        className='absolute inset-x-0 top-0 h-px'
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.12), rgba(45,212,191,0.10), rgba(168,85,247,0.12), transparent)' }}
      />

      <div className='mx-auto max-w-6xl'>
        {/* ── Top grid ── */}
        <div className='mb-10 grid gap-10 sm:grid-cols-[1fr_auto_auto]'>

          {/* Brand */}
          <div>
            <div className='mb-4 flex items-center gap-3'>
              <div
                className='rounded-lg p-1.5'
                style={{ border: '1px solid rgba(0,229,255,0.15)', background: 'rgba(0,229,255,0.05)' }}
              >
                <LogoSvg size={24} />
              </div>
              <div>
                <p className='font-mono text-sm font-bold text-white'>Joshua Silva</p>
                <p className='font-mono text-[10px] text-gray-500'>Full Stack Developer</p>
              </div>
            </div>

            <p className='mb-4 max-w-xs font-mono text-xs leading-relaxed text-gray-500'>
              Building high-performance web applications with military precision
              and a passion for clean, elegant code.
            </p>

            {/* Coords */}
            <p className='font-mono text-[9px] uppercase tracking-[0.15em] text-gray-700'>
              ◉ {COORDS}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className='mb-4 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-gray-600'>
              Navigation
            </h4>
            <ul className='space-y-2.5'>
              {NAV_LINKS.map(l => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className='font-mono text-sm text-gray-500 transition-colors hover:text-white'
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className='mb-4 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-gray-600'>
              Channels
            </h4>
            <ul className='space-y-2.5'>
              {SOCIAL_LINKS.map(l => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`font-mono text-sm text-gray-500 transition-colors ${l.accent}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className='mb-6 h-px'
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
        />

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='flex flex-col items-center justify-between gap-4 sm:flex-row'
        >
          <p className='font-mono text-[10px] text-gray-700'>
            © {year} Joshua Silva · All rights reserved
          </p>

          {/* Tech stack pills */}
          <div className='flex flex-wrap items-center justify-center gap-x-2 gap-y-1'>
            {['Next.js', 'TypeScript', 'Tailwind', 'Three.js', 'Framer Motion'].map((tech, i) => (
              <span key={tech} className='flex items-center gap-2 font-mono text-[9px] text-gray-700'>
                {i > 0 && <span className='text-gray-800'>·</span>}
                {tech}
              </span>
            ))}
          </div>

          {/* Signal indicator */}
          <div className='flex items-center gap-1.5'>
            <span className='relative flex h-1.5 w-1.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-50' />
              <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-400/60' />
            </span>
            <span className='font-mono text-[9px] uppercase tracking-widest text-gray-700'>
              Signal Nominal
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
