'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── terminal lines ──────────────────────────────────────────────── */
const TERMINAL_LINES = [
  { text: '$ ./initialize_mission_brief.sh', color: 'text-cyan-400',   delay: 0    },
  { text: '> Establishing secure channel…',  color: 'text-gray-400',   delay: 0.4  },
  { text: '> IDENTITY  : Joshua Silva',       color: 'text-white',      delay: 0.8  },
  { text: '> ROLE      : Full Stack Developer',color: 'text-white',     delay: 1.1  },
  { text: '> BACKGROUND: U.S. Army Sergeant | 6 Years Active Duty',
                                              color: 'text-white',      delay: 1.4  },
  { text: '> SPEC      : Frontend · React/Next.js · TypeScript · UI/UX',
                                              color: 'text-white',      delay: 1.7  },
  { text: '> MISSION STATUS: [AVAILABLE_FOR_HIRE]',
                                              color: 'text-green-400',  delay: 2.1  },
  { text: '> All systems nominal. ■',         color: 'text-gray-500',   delay: 2.5  },
];

/* ── stats with animated counter ────────────────────────────────── */
function CountStat({
  target,
  suffix,
  label,
  sub,
  color,
}: {
  target: number;
  suffix: string;
  label: string;
  sub: string;
  color: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  const glowMap: Record<string, string> = {
    cyan:   '0 0 18px rgba(0,229,255,0.4)',
    teal:   '0 0 18px rgba(45,212,191,0.4)',
    purple: '0 0 18px rgba(168,85,247,0.4)',
    indigo: '0 0 18px rgba(129,140,248,0.4)',
    amber:  '0 0 18px rgba(245,158,11,0.4)',
    green:  '0 0 18px rgba(74,222,128,0.4)',
  };
  const colorKey = Object.keys(glowMap).find(k => color.includes(k));
  const shadow   = colorKey ? glowMap[colorKey] : undefined;

  return (
    <div ref={ref} className='rounded-xl border border-white/8 bg-white/3 p-5 text-center backdrop-blur-sm'>
      <p
        className={`font-mono text-3xl font-black ${color}`}
        style={{ textShadow: shadow }}
      >
        {count}{suffix}
      </p>
      <p className='mt-1 font-mono text-xs font-bold text-white'>{label}</p>
      <p className='mt-0.5 font-mono text-[10px] text-gray-500'>{sub}</p>
    </div>
  );
}

/* ── section heading ─────────────────────────────────────────────── */
function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      className='mb-10 text-center md:mb-16'
    >
      <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/55'>
        {n} — {title}
      </p>
      <h2 className='font-mono text-3xl font-black sm:text-4xl md:text-5xl'>
        <span className='text-cyan-400'>Mission</span>
        <span className='mx-2 text-white/25'>/</span>
        <span className='text-white'>Brief</span>
      </h2>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────── */
const About: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inView = useInView(terminalRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const show = () => {
      if (i < TERMINAL_LINES.length) {
        setVisibleLines(++i);
        const next = TERMINAL_LINES[i];
        if (next) setTimeout(show, (next.delay - TERMINAL_LINES[i - 1].delay) * 1000);
      }
    };
    setTimeout(show, TERMINAL_LINES[0].delay * 1000);
  }, [inView]);

  const highlights = [
    {
      heading: 'Military Discipline',
      body: 'Six years as a U.S. Army Wheeled Mechanic and Sergeant forged the ability to perform under pressure, lead teams, and hold an uncompromising standard of excellence.',
      accent: 'text-cyan-400',
      border: 'border-cyan-400/20',
      glow: 'rgba(0,229,255,0.08)',
      icon: '◉',
    },
    {
      heading: 'The Career Pivot',
      body: 'After separating from service, passion for problem-solving drove a full retrain as a full-stack developer — completing intensive bootcamp training and launching a freelance career.',
      accent: 'text-purple-400',
      border: 'border-purple-400/20',
      glow: 'rgba(168,85,247,0.08)',
      icon: '◎',
    },
    {
      heading: 'Frontend Specialist',
      body: 'Specialising in React, Next.js, TypeScript, and Three.js — building performant, visually compelling applications with polished interfaces and clean, maintainable code.',
      accent: 'text-indigo-400',
      border: 'border-indigo-400/20',
      glow: 'rgba(129,140,248,0.08)',
      icon: '◈',
    },
  ];

  return (
    <section id='about' className='relative scroll-mt-20 px-4 py-16 md:py-24'>
      {/* Section glow */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 h-px'
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.15), transparent)' }}
      />

      <div className='mx-auto max-w-6xl'>
        <SectionLabel n='01' title='About' />

        <div className='grid gap-10 lg:grid-cols-[1fr_360px]'>
          {/* ── Left: narrative + terminal ── */}
          <div className='space-y-5'>
            {/* Terminal window */}
            <motion.div
              ref={terminalRef}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='overflow-hidden rounded-xl border border-white/8 bg-black/50 backdrop-blur-md'
              style={{ boxShadow: '0 0 40px rgba(0,229,255,0.05), 0 8px 32px rgba(0,0,0,0.5)' }}
            >
              {/* Title bar */}
              <div className='flex items-center gap-2 border-b border-white/8 px-4 py-3'>
                <span className='h-2.5 w-2.5 rounded-full bg-red-500/70' />
                <span className='h-2.5 w-2.5 rounded-full bg-yellow-500/70' />
                <span className='h-2.5 w-2.5 rounded-full bg-green-500/70' />
                <span className='ml-3 font-mono text-[10px] tracking-widest text-gray-500 uppercase'>
                  mission_brief.sh — terminal
                </span>
              </div>

              {/* Output lines */}
              <div className='p-5 space-y-1.5 min-h-55'>
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`font-mono text-[10px] leading-relaxed break-words sm:text-[11px] ${line.color}`}
                  >
                    {line.text}
                  </motion.p>
                ))}
                {visibleLines < TERMINAL_LINES.length && (
                  <span className='inline-block h-3 w-1.5 bg-cyan-400 opacity-80 animate-pulse' />
                )}
              </div>
            </motion.div>

            {/* Highlight cards */}
            {highlights.map((h, i) => (
              <motion.div
                key={h.heading}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`group rounded-xl border ${h.border} bg-white/2 p-6 backdrop-blur-sm transition-all hover:bg-white/5`}
                style={{ boxShadow: `0 0 0 1px transparent`, transition: 'box-shadow 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 30px ${h.glow}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 1px transparent')}
              >
                <div className={`mb-2 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${h.accent}`}>
                  <span>{h.icon}</span>
                  <span className='h-px w-6 bg-current opacity-50' />
                  {h.heading}
                </div>
                <p className='font-mono text-sm leading-relaxed text-gray-400'>{h.body}</p>
              </motion.div>
            ))}

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='border-l-2 border-teal-400/30 pl-4 font-mono text-sm italic text-gray-500'
            >
              &ldquo;The discipline that kept a squad safe on deployment is the same
              discipline that ships quality software on deadline.&rdquo;
            </motion.blockquote>
          </div>

          {/* ── Right: stats + veteran badge ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className='flex flex-col gap-4 self-start'
          >
            {/* Stats grid */}
            <div className='grid grid-cols-2 gap-3'>
              <CountStat target={6}   suffix='+' label='Years of Service'    sub='U.S. Army Sergeant' color='text-teal-400'   />
              <CountStat target={4}   suffix='+' label='Projects Delivered'  sub='Web Applications'   color='text-purple-400' />
              <CountStat target={10}  suffix='+' label='Technologies'        sub='Full Stack'          color='text-indigo-400' />
              <CountStat target={100} suffix='%' label='Commitment'          sub='Mission-First'       color='text-amber-400'  />
            </div>

            {/* Veteran badge */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className='flex items-center gap-4 rounded-xl border border-teal-400/20 bg-teal-400/4 p-5 backdrop-blur-sm'
              style={{ boxShadow: '0 0 20px rgba(45,212,191,0.06)' }}
            >
              <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-teal-400/30 bg-teal-400/10 text-2xl'>
                🎖️
              </div>
              <div>
                <p className='font-mono text-sm font-bold text-teal-400'>U.S. Army Veteran</p>
                <p className='font-mono text-[11px] text-gray-400'>Sergeant · Wheeled Mechanic</p>
                <p className='font-mono text-[10px] text-gray-500'>2017 – 2023 · 6 Years Active Duty</p>
              </div>
            </motion.div>

            {/* Quick skills callout */}
            <div className='rounded-xl border border-indigo-400/20 bg-indigo-400/3 p-5'>
              <p className='mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400/70'>
                Core Skills
              </p>
              <div className='flex flex-wrap gap-2'>
                {['React', 'Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Figma'].map(tag => (
                  <span
                    key={tag}
                    className='rounded-md border border-indigo-400/15 bg-indigo-400/6 px-2.5 py-1 font-mono text-[10px] text-indigo-300/70'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
