'use client';

import React from 'react';
import { motion } from 'framer-motion';

/* ── case study data ──────────────────────────────────────────────── */
const CASE_STUDIES = [
  {
    id: 'buses-for-sale',
    mission: 'CLIENT-01',
    title: 'BusesForSale',
    role: 'UI improvement, CMS implementation, debugging',
    accent:   '#00e5ff',
    glow:     'rgba(0,229,255,0.16)',
    gradient: 'from-cyan-950/60 via-blue-950/40 to-transparent',
    what: [
      'Responsive UI improvements across production CMS pages',
      'Built and styled author-profile experiences',
      'Improved navigation, content presentation, and pagination interfaces',
      'SEO-oriented content implementation and HubSpot integrations',
      'Country-filtering UI and capacity-related informational UI',
      'Debugged sell-your-bus form submission and image-upload issues',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'FocusPoint CMS', 'HubSpot'],
    outcome: 'Resolved production layout issues and improved mobile usability across the site.',
  },
  {
    id: 'lovato',
    mission: 'CLIENT-02',
    title: 'Lovato B2B Portal',
    role: 'Enterprise UX, checkout flow, responsive frontend',
    accent:   '#a855f7',
    glow:     'rgba(168,85,247,0.18)',
    gradient: 'from-purple-950/60 via-violet-950/40 to-transparent',
    what: [
      'Redesigned and refined the B2B portal UI, including header, footer, and side navigation',
      'Improved shopping-cart, product list, and order-review presentation',
      'Corrected the purchase-order checkout flow and credit-card conditional behavior',
      'Fixed clipped order-confirmation information and improved accessibility',
      'Improved invoice-selection, order-history filtering, and quote-list interactions',
      'Debugged Kendo Grid behavior, pagination, filters, and calendar/date interactions',
      'Added promotional portal banners with English and French support',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'FocusPoint CMS'],
    outcome: 'Simplified the checkout interaction and improved information hierarchy across the customer portal.',
    featured: true,
    live: 'https://lovato-portal-redesign.vercel.app',
  },
  {
    id: 'jackson-pottery',
    mission: 'CLIENT-03',
    title: 'Jackson Pottery',
    role: 'E-commerce UI, state-based UI, layout debugging',
    accent:   '#f59e0b',
    glow:     'rgba(245,158,11,0.16)',
    gradient: 'from-amber-950/60 via-yellow-950/40 to-transparent',
    what: [
      'Improved factory and product card interfaces',
      'Implemented conditional UI states such as "Coming Soon"',
      'Managed visibility of unavailable / in-progress container actions',
      'Improved cart item layout, increasing product-image prominence',
      'Improved quantity, information, and remove-action hierarchy',
      'Resolved responsive/modal layout issues, including background-width overflow during dialogs',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'FocusPoint CMS'],
    outcome: 'Reduced UI inconsistencies and resolved production layout issues on modal dialogs.',
    live: 'https://jacksonpotterytest.focuspointb1.com/',
  },
];

const SECONDARY_WORK = [
  {
    id: 'uniform-ordering',
    title: 'Uniform Ordering Interface',
    points: [
      'Improved mobile category accordion experience',
      'Added clearer product/category counts and responsive interaction',
    ],
  },
  {
    id: 'bulk-ordering',
    title: 'Bulk Ordering / Multi-Order Interface',
    points: [
      'Improved desktop and mobile bulk-order grid UX',
      'Improved inline "Add to Cart" interactions and troubleshot delete behavior',
    ],
  },
];

/* ── case study card ──────────────────────────────────────────────── */
function CaseStudyCard({
  study,
  delay,
}: {
  study: (typeof CASE_STUDIES)[number];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className='relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur-sm transition-all duration-300'
      onMouseEnter={e =>
        ((e.currentTarget as HTMLElement).style.boxShadow = `0 0 50px ${study.glow}, 0 8px 40px rgba(0,0,0,0.6)`)
      }
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = 'none')}
    >
      {/* header */}
      <div className={`relative bg-linear-to-br ${study.gradient} px-6 pb-4 pt-5`}>
        <div className='flex items-center justify-between'>
          <span className='font-mono text-[9px] uppercase tracking-[0.25em] text-white/30'>
            {study.mission}
          </span>
          {study.featured && (
            <span
              className='rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold text-white/80 border'
              style={{ borderColor: `${study.accent}50`, background: `${study.accent}18` }}
            >
              ★ Featured
            </span>
          )}
        </div>
        <div className='mt-2 flex items-end gap-3'>
          <div
            className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-bold'
            style={{ background: `${study.accent}20`, border: `1px solid ${study.accent}40`, color: study.accent }}
          >
            ◈
          </div>
          <h3 className='font-mono text-lg font-black leading-tight text-white'>{study.title}</h3>
        </div>
        <p className='mt-2 font-mono text-[11px] text-gray-400'>{study.role}</p>
      </div>

      {/* body */}
      <div className='flex flex-1 flex-col p-6'>
        <p className='mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500'>
          Completed via FocusPoint
        </p>
        <ul className='mb-4 flex-1 space-y-1.5'>
          {study.what.map(line => (
            <li key={line} className='flex gap-2 font-mono text-[12px] leading-relaxed text-gray-400'>
              <span style={{ color: study.accent }}>▸</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className='mb-4 flex flex-wrap gap-1.5'>
          {study.stack.map(tech => (
            <span
              key={tech}
              className='rounded-md border border-white/8 bg-white/3 px-2.5 py-1 font-mono text-[10px] text-gray-500'
            >
              {tech}
            </span>
          ))}
        </div>

        <div className='border-t border-white/8 pt-3'>
          <p className='font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500'>Outcome</p>
          <p className='mt-1 font-mono text-[12px] leading-relaxed' style={{ color: study.accent }}>
            {study.outcome}
          </p>
        </div>

        {study.live && (
          <motion.a
            href={study.live}
            target='_blank'
            rel='noopener noreferrer'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='mt-4 flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2 font-mono text-[11px] font-bold transition-all hover:opacity-90'
            style={{
              borderColor: `${study.accent}35`,
              color: study.accent,
              background: `${study.accent}10`,
            }}
          >
            <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
            </svg>
            View Live Design
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────── */
const ProfessionalWork: React.FC = () => (
  <section id='work' className='relative scroll-mt-20 px-4 py-16 md:py-24'>
    <div
      aria-hidden
      className='pointer-events-none absolute inset-x-0 top-0 h-px'
      style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.14), transparent)' }}
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
          03 — Professional Work
        </p>
        <h2 className='font-mono text-3xl font-black sm:text-4xl md:text-5xl'>
          <span className='text-cyan-400'>Selected</span>
          <span className='mx-2 text-white/25'>/</span>
          <span className='text-white'>Client Work</span>
        </h2>
        <p className='mt-4 font-mono text-sm text-gray-500'>
          Production UI/UX work completed as a UI/UX Specialist at FocusPoint
        </p>
      </motion.div>

      {/* Case study grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {CASE_STUDIES.map((study, i) => (
          <CaseStudyCard key={study.id} study={study} delay={i * 0.08} />
        ))}
      </div>

      {/* Secondary work */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className='mt-6 grid gap-4 sm:grid-cols-2'
      >
        {SECONDARY_WORK.map(item => (
          <div
            key={item.id}
            className='rounded-xl border border-white/8 bg-white/2 p-5 backdrop-blur-sm'
          >
            <p className='mb-2 font-mono text-xs font-bold uppercase tracking-widest text-gray-400'>
              {item.title}
            </p>
            <ul className='space-y-1'>
              {item.points.map(p => (
                <li key={p} className='flex gap-2 font-mono text-[11px] leading-relaxed text-gray-500'>
                  <span className='text-cyan-400/60'>▸</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ProfessionalWork;
