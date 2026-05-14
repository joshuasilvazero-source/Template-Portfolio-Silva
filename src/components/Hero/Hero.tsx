'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const HEADLINE_1  = 'Full Stack Developer';
const HEADLINE_2  = 'Building Digital Universes';
const SUBHEADLINE =
  'Full-stack developer specializing in scalable systems, immersive 3D experiences, ' +
  'and high-performance web applications.';

const STACK = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Three.js', 'PostgreSQL',
];

const STATS = [
  { value: '4+', label: 'Projects Deployed',    color: 'text-teal-400',   glow: 'rgba(45,212,191,0.4)'  },
  { value: '6+', label: 'Yrs Military Service',  color: 'text-amber-400',  glow: 'rgba(245,158,11,0.4)'  },
  { value: '2+', label: 'Yrs Dev Experience',    color: 'text-indigo-400', glow: 'rgba(129,140,248,0.4)' },
];

/* ── HUD corner bracket ───────────────────────────────────────────── */
function HudCorner({
  side,
  label,
  delay = 0,
}: {
  side: 'tl' | 'br';
  label: string;
  delay?: number;
}) {
  const pos = { tl: 'top-20 left-6 md:left-12', br: 'bottom-20 right-6 md:right-12' }[side];
  const borderTop   = side === 'tl';
  const borderLeft  = side === 'tl';
  const borderRight = side === 'br';
  const borderBottom = side === 'br';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute hidden md:block ${pos}`}
    >
      <div
        className='h-10 w-10 border-cyan-400/30'
        style={{
          borderTopWidth:    borderTop    ? 1 : 0,
          borderLeftWidth:   borderLeft   ? 1 : 0,
          borderRightWidth:  borderRight  ? 1 : 0,
          borderBottomWidth: borderBottom ? 1 : 0,
          borderStyle: 'solid',
        }}
      />
      <p
        className='mt-1 font-mono text-[7px] tracking-[0.2em] text-cyan-400/30 uppercase'
        style={{ textAlign: borderRight ? 'right' : 'left' }}
      >
        {label}
      </p>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────── */
const Hero: React.FC = () => {
  const [tick,     setTick]     = useState(false);
  const [typed1,   setTyped1]   = useState('');
  const [typed2,   setTyped2]   = useState('');
  const [typedSub, setTypedSub] = useState('');
  const [phase,    setPhase]    = useState(0); // 0=h1 1=h2 2=sub 3=done

  /* blinking cursor */
  useEffect(() => {
    const id = setInterval(() => setTick(t => !t), 530);
    return () => clearInterval(id);
  }, []);

  /* typewriter effect */
  useEffect(() => {
    let cancelled = false;

    function typeString(
      str: string,
      setter: React.Dispatch<React.SetStateAction<string>>,
      speed: number,
      onDone: () => void,
    ) {
      let i = 0;
      function step() {
        if (cancelled) return;
        setter(str.slice(0, ++i));
        if (i < str.length) setTimeout(step, speed);
        else onDone();
      }
      setTimeout(step, speed);
    }

    const boot = setTimeout(() => {
      if (cancelled) return;
      typeString(HEADLINE_1, setTyped1, 80, () => {
        if (cancelled) return;
        setTimeout(() => {
          if (cancelled) return;
          setPhase(1);
          typeString(HEADLINE_2, setTyped2, 65, () => {
            if (cancelled) return;
            setTimeout(() => {
              if (cancelled) return;
              setPhase(2);
              typeString(SUBHEADLINE, setTypedSub, 22, () => {
                if (!cancelled) setPhase(3);
              });
            }, 180);
          });
        }, 180);
      });
    }, 350);

    return () => { cancelled = true; clearTimeout(boot); };
  }, []);

  return (
    <section
      id='home'
      className='relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20'
    >
      {/* radial backdrop glows */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0'
        style={{
          background: [
            'radial-gradient(ellipse 80% 55% at 50% 35%, rgba(0,229,255,0.04) 0%, transparent 65%)',
            'radial-gradient(ellipse 50% 40% at 75% 60%, rgba(168,85,247,0.025) 0%, transparent 60%)',
          ].join(', '),
        }}
      />

      {/* scan-line texture */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0'
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
        }}
      />

      {/* HUD corners */}
      <HudCorner side='tl' label='J·SILVA'  delay={0.5} />
      <HudCorner side='br' label='EST·2024' delay={0.6} />

      {/* central content */}
      <div className='relative z-10 w-full max-w-4xl text-center'>

        {/* availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-8 flex justify-center'
        >
          <div className='inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 backdrop-blur-sm'>
            <span className='relative flex h-1.5 w-1.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75' />
              <span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400' />
            </span>
            <span className='font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-green-400/80'>
              Open to Work
            </span>
          </div>
        </motion.div>

        {/* monogram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className='mb-5 flex justify-center'
        >
          <div className='relative flex h-28 w-28 items-center justify-center'>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
              style={{ width: 56, height: 56, border: '1px dashed rgba(0,229,255,0.22)' }}
            >
              <span
                className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-cyan-400'
                style={{ boxShadow: '0 0 8px rgba(0,229,255,1), 0 0 16px rgba(0,229,255,0.5)' }}
              />
            </motion.div>

            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
              style={{ width: 82, height: 82, border: '1px dashed rgba(168,85,247,0.18)' }}
            >
              <span
                className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-purple-400'
                style={{ boxShadow: '0 0 6px rgba(168,85,247,0.9), 0 0 12px rgba(168,85,247,0.4)' }}
              />
            </motion.div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full'
              style={{ width: 110, height: 110, border: '1px solid rgba(99,102,241,0.10)' }}
            >
              <span
                className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-indigo-400'
                style={{ boxShadow: '0 0 6px rgba(99,102,241,0.85)' }}
              />
            </motion.div>

            <motion.div
              animate={{ boxShadow: [
                '0 0 20px rgba(0,229,255,0.10), inset 0 0 10px rgba(0,229,255,0.04)',
                '0 0 32px rgba(0,229,255,0.20), inset 0 0 16px rgba(0,229,255,0.07)',
                '0 0 20px rgba(0,229,255,0.10), inset 0 0 10px rgba(0,229,255,0.04)',
              ]}}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className='relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/25'
            >
              <span
                className='font-mono text-sm font-black text-cyan-400'
                style={{ textShadow: '0 0 10px rgba(0,229,255,0.7)' }}
              >
                JS
              </span>
            </motion.div>

          </div>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className='mb-4 font-mono font-black leading-none tracking-tight'
        >
          <span className='block min-h-7.5 md:min-h-9 lg:min-h-12'>
            <span className='text-3xl text-white/80 md:text-4xl lg:text-5xl'>
              {typed1}
            </span>
            {phase === 0 && (
              <span
                className='ml-0.5 inline-block h-[0.85em] w-0.5 translate-y-px bg-white/70'
                style={{ opacity: tick ? 1 : 0, transition: 'opacity 0.1s' }}
              />
            )}
          </span>

          <span className='block min-h-9 md:min-h-12 lg:min-h-18'>
            <span
              className='text-4xl md:text-5xl lg:text-7xl'
              style={{
                background: 'linear-gradient(130deg, #00e5ff 0%, #2dd4bf 25%, #a855f7 58%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 28px rgba(0,229,255,0.2))',
              }}
            >
              {typed2}
            </span>
            {phase === 1 && (
              <span
                className='ml-1 inline-block h-[0.75em] w-0.75 translate-y-px bg-cyan-400'
                style={{ opacity: tick ? 1 : 0, transition: 'opacity 0.1s', boxShadow: '0 0 8px rgba(0,229,255,0.9)' }}
              />
            )}
          </span>
        </motion.h1>

        {/* subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className='mx-auto mb-10 max-w-xl font-sans text-sm leading-relaxed text-gray-400 md:text-base'
        >
          {typedSub}
          {(phase === 2 || phase === 3) && (
            <span
              className='ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 bg-cyan-400'
              style={{ opacity: tick ? 1 : 0, transition: 'opacity 0.1s' }}
            />
          )}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className='mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row'
        >
          <motion.a
            href='#projects'
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className='rounded-lg px-7 py-3 font-mono text-sm font-bold text-black'
            style={{
              background: 'linear-gradient(135deg, #00e5ff, #0ea5e9)',
              boxShadow: '0 0 24px rgba(0,229,255,0.32), 0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            View Projects
          </motion.a>

          <motion.a
            href='#contact'
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className='rounded-lg border border-cyan-400/35 bg-cyan-400/5 px-7 py-3 font-mono text-sm font-bold text-cyan-400 backdrop-blur-sm transition-colors hover:border-cyan-400/60 hover:bg-cyan-400/10'
          >
            Contact
          </motion.a>

          <motion.a
            href='#about'
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className='rounded-lg border border-white/10 bg-white/3 px-7 py-3 font-mono text-sm font-bold text-white/65 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-white/80'
          >
            About
          </motion.a>
        </motion.div>

        {/* tech stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className='mb-10 flex flex-wrap justify-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-gray-500'
        >
          {STACK.map((t, i) => (
            <span key={t} className='flex items-center gap-2'>
              {i > 0 && <span className='text-white/15'>·</span>}
              <span className='cursor-default transition-colors hover:text-gray-400'>{t}</span>
            </span>
          ))}
        </motion.div>

        {/* stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className='overflow-hidden rounded-xl border border-white/7 bg-white/2 backdrop-blur-sm'
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)' }}
        >
          <div className='grid grid-cols-3 divide-x divide-white/7'>
            {STATS.map(({ value, label, color, glow }) => (
              <div key={label} className='px-4 py-5 text-center'>
                <p
                  className={`font-mono text-3xl font-black md:text-4xl ${color}`}
                  style={{ textShadow: `0 0 20px ${glow}` }}
                >
                  {value}
                </p>
                <p className='mt-1.5 font-mono text-[9px] uppercase tracking-widest text-gray-500'>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* scroll indicator */}
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className='absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2'
      >
        <span className='font-mono text-[7px] uppercase tracking-[0.3em] text-white/20'>
          Scroll
        </span>
        <div
          className='h-8 w-px'
          style={{ background: 'linear-gradient(to bottom, rgba(0,229,255,0.3), transparent)' }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
