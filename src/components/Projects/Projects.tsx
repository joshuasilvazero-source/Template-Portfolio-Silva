'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ── project data ─────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 'job-tracker',
    mission: 'MISSION-01',
    title: 'Full Stack Job Tracker',
    description:
      'End-to-end job application manager with real-time status dashboard, statistics, CSV export, and a polished UI. Full auth, PostgreSQL persistence, and serverless API.',
    accent:   '#00e5ff',
    glow:     'rgba(0,229,255,0.18)',
    gradient: 'from-cyan-950/70 via-blue-950/50 to-transparent',
    tag:      'FULL STACK',
    tagColor: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
    stack:    ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind'],
    github:   'https://github.com/joshuasilvazero',
    live:     'https://example.com',
    featured: true,
  },
  {
    id: 'coffee',
    mission: 'MISSION-02',
    title: 'Warriors Blood Coffee',
    description:
      'E-commerce storefront for a veteran-owned premium coffee brand. Full Stripe checkout, order management, admin dashboard, and JWT authentication.',
    accent:   '#f97316',
    glow:     'rgba(249,115,22,0.18)',
    gradient: 'from-orange-950/70 via-red-950/50 to-transparent',
    tag:      'E-COMMERCE',
    tagColor: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
    stack:    ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT Auth'],
    github:   'https://github.com/joshuasilvazero',
    live:     'https://example.com',
  },
  {
    id: 'landscaping',
    mission: 'MISSION-03',
    title: 'Landscaping Booking Site',
    description:
      'Premium responsive marketing site with service showcase, photo gallery, and automated email contact form with Nodemailer notifications.',
    accent:   '#4ade80',
    glow:     'rgba(74,222,128,0.18)',
    gradient: 'from-green-950/70 via-emerald-950/50 to-transparent',
    tag:      'FRONTEND',
    tagColor: 'text-green-400 border-green-400/30 bg-green-400/5',
    stack:    ['Next.js', 'React', 'Tailwind CSS', 'Nodemailer'],
    github:   'https://github.com/joshuasilvazero',
    live:     'https://example.com',
  },
  {
    id: 'portfolio',
    mission: 'MISSION-04',
    title: 'Developer Portfolio Platform',
    description:
      'This very portfolio — a cinematic interstellar experience with Three.js galaxy, interactive black hole, runner game gate, and premium animations.',
    accent:   '#a855f7',
    glow:     'rgba(168,85,247,0.18)',
    gradient: 'from-purple-950/70 via-violet-950/50 to-transparent',
    tag:      'CREATIVE',
    tagColor: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
    stack:    ['Next.js', 'Three.js', 'Framer Motion', 'TypeScript', 'Tailwind'],
    github:   'https://github.com/joshuasilvazero',
    live:     'https://example.com',
  },
];

/* ── 3-D tilt card wrapper ────────────────────────────────────────── */
function TiltCard({ children, glow }: { children: React.ReactNode; glow: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 160, damping: 22 });
  const sy = useSpring(my, { stiffness: 160, damping: 22 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const shine   = useTransform(sx, [-0.5, 0.5], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.04)']);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r  = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };

  const handleLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.2 } }}
      className='h-full cursor-default'
    >
      {/* Shine layer */}
      <motion.div
        className='pointer-events-none absolute inset-0 z-10 rounded-2xl'
        style={{ background: shine }}
      />
      {children}
    </motion.div>
  );
}

/* ── single project card ──────────────────────────────────────────── */
function ProjectCard({
  project,
  delay,
}: {
  project: (typeof PROJECTS)[number];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className='relative h-full'
      style={{ perspective: 1200 }}
    >
      <TiltCard glow={project.glow}>
        <div
          className='relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur-sm transition-all duration-300'
          style={{ boxShadow: 'none' }}
          onMouseEnter={e =>
            ((e.currentTarget as HTMLElement).style.boxShadow = `0 0 50px ${project.glow}, 0 8px 40px rgba(0,0,0,0.6)`)
          }
          onMouseLeave={e =>
            ((e.currentTarget as HTMLElement).style.boxShadow = 'none')
          }
        >
          {/* ── gradient header ── */}
          <div className={`relative bg-linear-to-br ${project.gradient} h-28 px-6 pb-4 pt-5 flex flex-col justify-between`}>
            {/* Mission label + featured badge */}
            <div className='flex items-center justify-between'>
              <span className='font-mono text-[9px] uppercase tracking-[0.25em] text-white/30'>
                {project.mission}
              </span>
              {project.featured && (
                <span
                  className='rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold text-white/80 border'
                  style={{ borderColor: `${project.accent}50`, background: `${project.accent}18` }}
                >
                  ★ Featured
                </span>
              )}
            </div>

            {/* Title */}
            <div className='flex items-end gap-3'>
              <div
                className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-bold'
                style={{ background: `${project.accent}20`, border: `1px solid ${project.accent}40`, color: project.accent }}
              >
                ◈
              </div>
              <h3 className='font-mono text-lg font-black text-white leading-tight'>
                {project.title}
              </h3>
            </div>
          </div>

          {/* ── body ── */}
          <div className='flex flex-1 flex-col p-6'>
            {/* Category tag */}
            <div className='mb-4 flex items-center gap-2'>
              <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${project.tagColor}`}>
                {project.tag}
              </span>
              <div className='h-px flex-1' style={{ background: `${project.accent}20` }} />
            </div>

            {/* Description */}
            <p className='mb-5 flex-1 font-mono text-sm leading-relaxed text-gray-400'>
              {project.description}
            </p>

            {/* Stack */}
            <div className='mb-5 flex flex-wrap gap-1.5'>
              {project.stack.map(tech => (
                <span
                  key={tech}
                  className='rounded-md border border-white/8 bg-white/3 px-2.5 py-1 font-mono text-[10px] text-gray-500'
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className='flex gap-3 border-t border-white/8 pt-4'>
              <motion.a
                href={project.github}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/3 px-4 py-2 font-mono text-[11px] font-bold text-gray-400 transition-all hover:border-white/25 hover:text-white'
              >
                <svg className='h-3 w-3' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z' />
                </svg>
                Source
              </motion.a>

              <motion.a
                href={project.live}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className='flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-4 py-2 font-mono text-[11px] font-bold transition-all hover:opacity-90'
                style={{
                  borderColor: `${project.accent}35`,
                  color: project.accent,
                  background: `${project.accent}10`,
                }}
              >
                <svg className='h-3 w-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                </svg>
                Live Demo
              </motion.a>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ── main component ───────────────────────────────────────────────── */
const Projects: React.FC = () => (
  <section id='projects' className='relative px-4 py-24'>
    <div
      aria-hidden
      className='pointer-events-none absolute inset-x-0 top-0 h-px'
      style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.12), transparent)' }}
    />

    <div className='mx-auto max-w-6xl'>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className='mb-16 text-center'
      >
        <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/55'>
          03 — Work
        </p>
        <h2 className='font-mono text-4xl font-black md:text-5xl'>
          <span className='text-cyan-400'>Mission</span>
          <span className='mx-2 text-white/25'>/</span>
          <span className='text-white'>Deployments</span>
        </h2>
        <p className='mt-4 font-mono text-sm text-gray-500'>
          Hover cards to engage 3D interface · Click links to deploy
        </p>
      </motion.div>

      {/* Grid */}
      <div className='grid gap-6 md:grid-cols-2'>
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.id} project={project} delay={i * 0.08} />
        ))}
      </div>

      {/* GitHub CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className='mt-10 text-center'
      >
        <a
          href='https://github.com/joshuasilvazero'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 font-mono text-sm text-gray-500 transition-colors hover:text-cyan-400'
        >
          <svg className='h-3.5 w-3.5' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z' />
          </svg>
          View all missions on GitHub →
        </a>
      </motion.div>
    </div>
  </section>
);

export default Projects;
