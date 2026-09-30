'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/* ── data ─────────────────────────────────────────────────────────── */
const MISSIONS = [
  {
    id: 'focuspoint',
    log:     'LOG-001',
    status:  'ACTIVE',
    role:    'UI/UX Specialist | Frontend & CMS Implementation',
    org:     'FocusPoint · Remote',
    period:  '2026 – Present',
    icon:    '◈',
    accent:  'teal',
    description:
      'Design and implement production UI/UX enhancements across B2B portals and CMS-driven client sites, including BusesForSale, Lovato B2B Portal, and Jackson Pottery. I translate customer requirements, mockups, and visual direction into responsive interfaces, and diagnose frontend defects involving CSS specificity, responsive sizing, scrolling/overflow, grid behavior, pagination, and CMS constraints — working inside the FocusPoint CMS and existing client codebases rather than only greenfield builds.',
    highlights: [
      'UI/UX Design', 'Responsive Implementation', 'FocusPoint CMS',
      'Checkout & Account Workflows', 'Production Debugging', 'Jira & Slack',
    ],
  },
  {
    id: 'army',
    log:     'LOG-002',
    status:  'COMPLETED',
    role:    'Sergeant (E-5) / Wheeled Vehicle Mechanic (91B)',
    org:     'U.S. Army',
    period:  '2021 – 2026',
    icon:    '⛨',
    accent:  'cyan',
    description:
      'Led and mentored soldiers, coordinated maintenance operations and training, prioritized competing requirements, and maintained accountability in deadline-driven environments. Diagnosed complex mechanical, hydraulic, and electrical systems, strengthening structured troubleshooting, root-cause analysis, and problem-solving skills.',
    highlights: [
      'Team Leadership', 'Mechanical & Electrical Diagnostics', 'Training & Mentorship',
      'Systematic Troubleshooting', 'Accountability & Readiness',
    ],
  },
  {
    id: 'education',
    log:     'LOG-003',
    status:  'ARCHIVED',
    role:    'B.S. in Biology',
    org:     'University of Central Bayamón',
    period:  'May 2021',
    icon:    '◎',
    accent:  'purple',
    description:
      'Developed rigorous analytical thinking through laboratory science and research methodology — a foundation that carries into a systematic approach to debugging and product problem-solving.',
    highlights: [
      'Scientific Method', 'Data Analysis', 'Research Methodology', 'Critical Thinking',
    ],
  },
];

type Accent = 'cyan' | 'teal' | 'purple' | 'indigo';

const COLORS: Record<Accent, { text: string; dot: string; badge: string; tag: string }> = {
  cyan:   { text: 'text-cyan-400',   dot: 'bg-cyan-400',   badge: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',     tag: 'text-cyan-300   border-cyan-400/15   bg-cyan-400/5'   },
  teal:   { text: 'text-teal-400',   dot: 'bg-teal-400',   badge: 'text-teal-400 border-teal-400/30 bg-teal-400/5',     tag: 'text-teal-300   border-teal-400/15   bg-teal-400/5'   },
  purple: { text: 'text-purple-400', dot: 'bg-purple-400', badge: 'text-purple-400 border-purple-400/30 bg-purple-400/5', tag: 'text-purple-300 border-purple-400/15 bg-purple-400/5' },
  indigo: { text: 'text-indigo-400', dot: 'bg-indigo-400', badge: 'text-indigo-400 border-indigo-400/30 bg-indigo-400/5', tag: 'text-indigo-300 border-indigo-400/15 bg-indigo-400/5' },
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    'text-teal-400   border-teal-400/30   bg-teal-400/5',
  COMPLETED: 'text-cyan-400   border-cyan-400/30   bg-cyan-400/5',
  ARCHIVED:  'text-gray-400   border-gray-400/30   bg-gray-400/5',
};

/* ── animated progress line ──────────────────────────────────────── */
function ProgressLine() {
  const ref  = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className='absolute top-0 bottom-0 left-3 w-px overflow-hidden'>
      <div className='absolute inset-0 bg-white/5' />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className='absolute inset-0 origin-top'
        style={{ background: 'linear-gradient(to bottom, #00e5ff, #2dd4bf 35%, rgba(168,85,247,0.65) 70%, transparent)' }}
      />
    </div>
  );
}

/* ── single mission entry ─────────────────────────────────────────── */
function MissionEntry({ mission, i }: { mission: (typeof MISSIONS)[number]; i: number }) {
  const c = COLORS[mission.accent as Accent];

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className='group relative'
    >
      {/* Timeline dot */}
      <div
        className={`absolute -left-[21px] top-6 h-3.5 w-3.5 rounded-full ${c.dot} z-10`}
        style={{ boxShadow: `0 0 12px currentColor` }}
      />
      {/* Pulse ring on active */}
      {mission.status === 'ACTIVE' && (
        <div
          className={`absolute -left-[22px] top-[23px] h-3.5 w-3.5 rounded-full ${c.dot} animate-ping opacity-40`}
        />
      )}

      <div
        className='rounded-2xl border border-white/8 bg-black/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/3'
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`)}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
      >
        {/* Header */}
        <div className='mb-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
          <div className='flex items-start gap-3'>
            <div
              className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm'
              style={{ background: `currentColor10` }}
            >
              <span className={c.text}>{mission.icon}</span>
            </div>
            <div>
              <p className='font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-0.5'>{mission.log}</p>
              <h3 className='font-mono text-base font-bold text-white'>{mission.role}</h3>
              <p className={`font-mono text-sm font-bold ${c.text}`}>{mission.org}</p>
            </div>
          </div>

          <div className='flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end'>
            <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${STATUS_COLORS[mission.status]}`}>
              {mission.status}
            </span>
            <span className='font-mono text-xs text-gray-500'>{mission.period}</span>
          </div>
        </div>

        {/* Divider */}
        <div className='my-4 h-px bg-white/5' />

        {/* Description */}
        <p className='mb-4 font-mono text-sm leading-relaxed text-gray-400'>{mission.description}</p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2'>
          {mission.highlights.map(h => (
            <span
              key={h}
              className={`rounded-md border px-2.5 py-1 font-mono text-[10px] ${c.tag}`}
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────── */
const Experience: React.FC = () => (
  <section id='experience' className='relative scroll-mt-20 px-4 py-16 md:py-24'>
    <div
      aria-hidden
      className='pointer-events-none absolute inset-x-0 top-0 h-px'
      style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.12), transparent)' }}
    />

    <div className='mx-auto max-w-4xl'>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className='mb-10 text-center md:mb-16'
      >
        <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/55'>
          05 — Journey
        </p>
        <h2 className='font-mono text-3xl font-black sm:text-4xl md:text-5xl'>
          <span className='text-cyan-400'>Galactic</span>
          <span className='mx-2 text-white/25'>/</span>
          <span className='text-white'>Mission Log</span>
        </h2>
        <p className='mt-4 font-mono text-sm text-gray-500'>
          Classified operation records · Clearance granted
        </p>
      </motion.div>

      {/* Timeline */}
      <div className='relative pl-10'>
        <ProgressLine />

        <div className='space-y-8'>
          {MISSIONS.map((m, i) => (
            <MissionEntry key={m.id} mission={m} i={i} />
          ))}
        </div>

        {/* Origin marker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className='mt-8 flex items-center gap-3 pl-0'
        >
          <div className='absolute left-[5px] h-4 w-4 rounded-full border border-white/15 bg-white/5' />
          <p className='ml-8 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600'>
            ◎ Origin Point · Trajectory Continues
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Experience;
