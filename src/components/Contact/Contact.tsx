'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface FormData { name: string; email: string; message: string }

/* ── blinking cursor helper ──────────────────────────────────────── */
function BlinkCursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className='ml-0.5 inline-block h-[0.9em] w-0.5 translate-y-px bg-cyan-400'
      style={{ opacity: on ? 1 : 0, transition: 'opacity 0.05s' }}
    />
  );
}

/* ── social / contact link card ─────────────────────────────────── */
function ContactLink({
  label,
  value,
  href,
  accent,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      whileHover={{ x: 4 }}
      className='group flex items-center gap-4 rounded-xl border border-white/8 bg-white/2 p-4 backdrop-blur-sm transition-all duration-200 hover:border-white/15 hover:bg-white/4'
    >
      <div
        className='flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-all duration-200'
        style={{ borderColor: `${accent}30`, background: `${accent}10` }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div className='min-w-0'>
        <p className='font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500'>{label}</p>
        <p className='truncate font-mono text-sm text-gray-300 transition-colors group-hover:text-white'>
          {value}
        </p>
      </div>
      <svg
        className='ml-auto h-4 w-4 shrink-0 text-gray-600 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white/40'
        fill='none' stroke='currentColor' viewBox='0 0 24 24'
      >
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 5l7 7-7 7' />
      </svg>
    </motion.a>
  );
}

/* ── main component ───────────────────────────────────────────────── */
const Contact: React.FC = () => {
  const [form,    setForm]    = useState<FormData>({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        toast.success('Transmission received — I\'ll respond within 24h.');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setSent(false), 4000);
      } else {
        toast.error(data.error ?? 'Transmission failed — please retry.');
      }
    } catch {
      toast.error('Network error — please retry.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = [
    'w-full rounded-lg border border-white/8 bg-white/3 px-4 py-3',
    'font-mono text-sm text-white placeholder-gray-600',
    'outline-none transition-all duration-200',
    'focus:border-cyan-400/50 focus:bg-white/5',
    'hover:border-white/15',
  ].join(' ');

  return (
    <section id='contact' className='relative scroll-mt-20 px-4 py-16 md:py-24'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 h-px'
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.12), transparent)' }}
      />

      <div className='mx-auto max-w-5xl'>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className='mb-4 text-center'
        >
          <p className='mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/55'>
            05 — Contact
          </p>
          <h2 className='font-mono text-3xl font-black sm:text-4xl md:text-5xl'>
            <span className='text-cyan-400'>Transmission</span>
            <span className='mx-2 text-white/25'>/</span>
            <span className='text-white'>Center</span>
          </h2>
        </motion.div>

        {/* CTA text with typewriter feel */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='mb-12 text-center font-mono text-sm text-gray-400'
        >
          Ready to launch your next digital mission?
          <BlinkCursor />
        </motion.p>

        <div className='grid gap-8 lg:grid-cols-[1fr_300px]'>
          {/* ── Form ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='overflow-hidden rounded-2xl border border-white/8 bg-black/40 backdrop-blur-md'
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}
          >
            {/* Terminal bar */}
            <div className='flex items-center gap-2 border-b border-white/8 px-5 py-3'>
              <span className='h-2 w-2 rounded-full bg-red-500/60' />
              <span className='h-2 w-2 rounded-full bg-yellow-500/60' />
              <span className='h-2 w-2 rounded-full bg-green-500/60' />
              <span className='ml-3 font-mono text-[9px] uppercase tracking-widest text-gray-500'>
                secure_transmission.sh
              </span>
              <span className='ml-auto flex h-1.5 w-1.5 rounded-full bg-green-400'>
                <span className='h-1.5 w-1.5 animate-ping rounded-full bg-green-400 opacity-75' />
              </span>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-5'>
              <div className='grid gap-5 sm:grid-cols-2'>
                <div>
                  <label htmlFor='name' className='mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500'>
                    Operator Name
                  </label>
                  <input
                    type='text' id='name' name='name'
                    value={form.name} onChange={handleChange}
                    required placeholder='Your name'
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor='email' className='mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500'>
                    Comm Channel (Email)
                  </label>
                  <input
                    type='email' id='email' name='email'
                    value={form.email} onChange={handleChange}
                    required placeholder='your@email.com'
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor='message' className='mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500'>
                  Mission Details
                </label>
                <textarea
                  id='message' name='message'
                  value={form.message} onChange={handleChange}
                  required rows={5}
                  placeholder='Describe your mission...'
                  className={`${inputClass} resize-none`}
                />
              </div>

              <motion.button
                type='submit'
                disabled={loading || sent}
                whileHover={!loading && !sent ? { scale: 1.02, y: -1 } : {}}
                whileTap={!loading && !sent ? { scale: 0.98 } : {}}
                className='relative w-full overflow-hidden rounded-lg py-3.5 font-mono text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60'
                style={{
                  background: sent
                    ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                    : 'linear-gradient(135deg, #00e5ff, #0ea5e9)',
                  boxShadow: sent
                    ? '0 0 24px rgba(74,222,128,0.35)'
                    : '0 0 28px rgba(0,229,255,0.3)',
                  color: '#000',
                }}
              >
                <AnimatePresence mode='wait'>
                  {loading ? (
                    <motion.span
                      key='loading'
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className='flex items-center justify-center gap-2'
                    >
                      <svg className='h-4 w-4 animate-spin' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                      </svg>
                      Transmitting…
                    </motion.span>
                  ) : sent ? (
                    <motion.span
                      key='sent'
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    >
                      ✓ Transmission Received
                    </motion.span>
                  ) : (
                    <motion.span
                      key='idle'
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                      ◈ Initiate Transmission →
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>

          {/* ── Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='flex flex-col gap-3'
          >
            <ContactLink
              label='Email'
              value='joshuasilvazero@gmail.com'
              href='mailto:joshuasilvazero@gmail.com'
              accent='#00e5ff'
              icon={
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
              }
            />
            <ContactLink
              label='GitHub'
              value='github.com/joshuasilvazero-source'
              href='https://github.com/joshuasilvazero-source'
              accent='#818cf8'
              icon={
                <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.17c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z' />
                </svg>
              }
            />
            <ContactLink
              label='LinkedIn'
              value='linkedin.com/in/joshua-silva-14027026a'
              href='https://www.linkedin.com/in/joshua-silva-14027026a/'
              accent='#2dd4bf'
              icon={
                <svg className='h-4 w-4' viewBox='0 0 24 24' fill='currentColor'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
              }
            />

            {/* Availability card */}
            <div className='mt-1 rounded-xl border border-teal-400/20 bg-teal-400/4 p-5'>
              <div className='mb-2 flex items-center gap-2'>
                <span className='relative flex h-2 w-2'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75' />
                  <span className='relative inline-flex h-2 w-2 rounded-full bg-teal-400' />
                </span>
                <span className='font-mono text-xs font-bold text-teal-400'>Online · Available</span>
              </div>
              <p className='font-mono text-[11px] text-gray-500 leading-relaxed'>
                Open to full-time roles and freelance projects.
                <br />Typical response: within 24h.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
