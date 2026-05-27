'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* ── data ─────────────────────────────────────────────────────────── */
const MODULES = [
  {
    id: 'frontend',
    label: 'Frontend Systems',
    icon: '◈',
    accent: 'cyan',
    skills: [
      'HTML5', 'CSS3', 'JavaScript (ES2024)', 'TypeScript',
      'React 18', 'Next.js 15', 'Tailwind CSS', 'Framer Motion',
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Workflow',
    icon: '◉',
    accent: 'purple',
    skills: [
      'Git / GitHub', 'Vite', 'Webpack', 'npm / yarn',
      'VS Code', 'ESLint / Prettier', 'Storybook', 'Chrome DevTools',
    ],
  },
  {
    id: 'quality',
    label: 'Performance & Quality',
    icon: '◎',
    accent: 'indigo',
    skills: [
      'Lighthouse', 'Web Vitals', 'Vitest / Jest', 'Playwright',
      'Accessibility (WCAG)', 'SEO', 'Responsive Design', 'Code Review',
    ],
  },
  {
    id: 'creative',
    label: '3D & Creative',
    icon: '✦',
    accent: 'teal',
    skills: [
      'Three.js', 'WebGL', 'Framer Motion', 'GSAP',
      'UI/UX Design', 'Responsive Design', 'Accessibility', 'Figma',
    ],
  },
];

const ALSO = [
  'Responsive Design', 'Performance Optimisation', 'Accessibility (WCAG)',
  'Testing & QA', 'Code Review', 'Documentation', 'Agile / Scrum', 'SEO',
  'Three.js', 'WebGL', 'Figma', 'Technical Writing',
];

type Accent = 'cyan' | 'purple' | 'indigo' | 'teal';

const PALETTE: Record<Accent, { border: string; glow: string; text: string; tag: string; tagBg: string; bar: string }> = {
  cyan:   { border: 'border-cyan-400/20',   glow: 'rgba(0,229,255,0.12)',   text: 'text-cyan-400',   tag: 'border-cyan-400/20',   tagBg: 'bg-cyan-400/5',   bar: '#00e5ff' },
  purple: { border: 'border-purple-400/20', glow: 'rgba(168,85,247,0.12)',  text: 'text-purple-400', tag: 'border-purple-400/20', tagBg: 'bg-purple-400/5', bar: '#a855f7' },
  indigo: { border: 'border-indigo-400/20', glow: 'rgba(129,140,248,0.12)', text: 'text-indigo-400', tag: 'border-indigo-400/20', tagBg: 'bg-indigo-400/5', bar: '#818cf8' },
  teal:   { border: 'border-teal-400/20',   glow: 'rgba(45,212,191,0.12)',  text: 'text-teal-400',   tag: 'border-teal-400/20',   tagBg: 'bg-teal-400/5',   bar: '#2dd4bf' },
};

/* ── skill module card ────────────────────────────────────────────── */
function SkillModule({
  module,
  delay,
}: {
  module: (typeof MODULES)[number];
  delay: number;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const p = PALETTE[module.accent as Accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative rounded-2xl border ${p.border} bg-black/30 p-6 backdrop-blur-sm transition-all duration-300`}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 40px ${p.glow}, 0 8px 32px rgba(0,0,0,0.5)`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Orbit decoration */}
      <div
        className='pointer-events-none absolute -top-3 -right-3 h-20 w-20 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100'
        style={{ border: `1px solid ${p.bar}30`, animation: 'orbit-spin 8s linear infinite' }}
      />

      {/* Header */}
      <div className='mb-5 flex items-center gap-3'>
        <div
          className='flex h-9 w-9 items-center justify-center rounded-lg'
          style={{ background: `${p.bar}15`, border: `1px solid ${p.bar}30` }}
        >
          <span className={`font-mono text-base ${p.text}`}>{module.icon}</span>
        </div>
        <div>
          <div className='flex items-center gap-2'>
            <div className='h-px w-5 rounded-full' style={{ background: p.bar, opacity: 0.6 }} />
            <h3 className={`font-mono text-xs font-bold uppercase tracking-widest ${p.text}`}>
              {module.label}
            </h3>
          </div>
          <p className='font-mono text-[9px] text-gray-600 tracking-widest uppercase mt-0.5'>
            {module.skills.length} modules loaded
          </p>
        </div>
      </div>

      {/* Skill tags */}
      <div className='flex flex-wrap gap-2'>
        {module.skills.map((skill, i) => (
          <motion.button
            key={skill}
            type='button'
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + i * 0.035, duration: 0.3 }}
            whileHover={{ scale: 1.08, y: -1 }}
            onMouseEnter={() => setHovered(skill)}
            onMouseLeave={() => setHovered(null)}
            className={`cursor-default rounded-md border px-3 py-1.5 font-mono text-xs transition-all duration-200 ${p.tag} ${p.tagBg}`}
            style={{
              color: hovered === skill ? p.bar : undefined,
              boxShadow: hovered === skill ? `0 0 12px ${p.glow}` : undefined,
              borderColor: hovered === skill ? `${p.bar}60` : undefined,
            }}
          >
            {skill}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────── */
const Skills: React.FC = () => (
  <section id='skills' className='relative scroll-mt-20 px-4 py-16 md:py-24'>
    {/* Top divider */}
    <div
      aria-hidden
      className='pointer-events-none absolute inset-x-0 top-0 h-px'
      style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.15), transparent)' }}
    />

    <div className='mx-auto max-w-6xl'>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className='mb-10 text-center md:mb-16'
      >
        <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/55'>
          02 — Skills
        </p>
        <h2 className='font-mono text-3xl font-black sm:text-4xl md:text-5xl'>
          <span className='text-cyan-400'>System</span>
          <span className='mx-2 text-white/25'>/</span>
          <span className='text-white'>Modules</span>
        </h2>
        <p className='mt-4 font-mono text-sm text-gray-500'>
          All systems operational · Hover to activate node
        </p>
      </motion.div>

      {/* ── Core module grid ── */}
      <div className='mb-8 grid gap-5 md:grid-cols-2'>
        {MODULES.map((mod, i) => (
          <SkillModule key={mod.id} module={mod} delay={i * 0.08} />
        ))}
      </div>

      {/* ── Also proficient strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className='rounded-xl border border-white/8 bg-white/2 px-6 py-5 backdrop-blur-sm'
      >
        <div className='mb-3 flex items-center gap-3'>
          <div className='h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent' />
          <p className='font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-gray-500'>
            Also proficient in
          </p>
          <div className='h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent' />
        </div>
        <div className='flex flex-wrap justify-center gap-2'>
          {ALSO.map(s => (
            <span
              key={s}
              className='cursor-default rounded-md border border-white/8 bg-white/3 px-3 py-1 font-mono text-xs text-gray-500 transition-colors hover:border-white/15 hover:text-gray-300'
            >
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default Skills;
