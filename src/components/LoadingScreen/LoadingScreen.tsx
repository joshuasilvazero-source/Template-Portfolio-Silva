'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUSES = [
  'INITIALIZING SYSTEMS',
  'CALIBRATING NEURAL INTERFACE',
  'ESTABLISHING DEEP SPACE LINK',
  'LOADING MISSION DATA',
  'SYSTEMS ONLINE',
];

export const LoadingScreen: React.FC = () => {
  const [visible,  setVisible]  = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    let p = 0;
    const tick = setInterval(() => {
      p += Math.random() * 24 + 6;
      if (p > 100) p = 100;
      setProgress(Math.floor(p));
      setStatusIdx(Math.min(Math.floor((p / 100) * STATUSES.length), STATUSES.length - 1));
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => setVisible(false), 550);
      }
    }, 340);
    return () => clearInterval(tick);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className='fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000510]'
        >
          {/* Corner brackets */}
          {(['top-8 left-8 border-t border-l', 'top-8 right-8 border-t border-r',
             'bottom-8 left-8 border-b border-l', 'bottom-8 right-8 border-b border-r'] as const
          ).map((cls, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              className={`absolute h-10 w-10 border-blue-500/35 ${cls}`}
            />
          ))}

          {/* Monogram */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className='mb-10 flex h-28 w-28 items-center justify-center rounded-full border border-blue-500/40'
            style={{ boxShadow: '0 0 50px rgba(59,130,246,0.35), 0 0 100px rgba(59,130,246,0.12), inset 0 0 30px rgba(59,130,246,0.08)' }}
          >
            <span
              className='text-4xl font-black text-blue-400'
              style={{ fontFamily: 'monospace', letterSpacing: '-0.05em', textShadow: '0 0 20px rgba(96,165,250,0.8)' }}
            >
              JS
            </span>
          </motion.div>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className='mb-2 font-mono text-sm font-bold uppercase tracking-[0.3em] text-white/80'
          >
            Joshua Silva
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.6 }}
            className='mb-10 font-mono text-[10px] tracking-widest text-blue-400/60'
          >
            FULL STACK DEVELOPER · MISSION CONTROL
          </motion.p>

          {/* Status */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className='mb-5 font-mono text-xs tracking-widest text-blue-400/70'
          >
            {STATUSES[statusIdx]}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.9 }}
              className='ml-0.5'
            >
              _
            </motion.span>
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className='relative h-[1px] overflow-hidden rounded-full bg-white/8'
            style={{ width: 300, transformOrigin: 'left' }}
          >
            <div
              className='absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300'
              style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(59,130,246,0.9)' }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 1 }}
            className='mt-3 font-mono text-[10px] tabular-nums text-slate-500'
          >
            {String(progress).padStart(3, '0')} / 100
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
