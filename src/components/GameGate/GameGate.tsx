'use client';

import React, { useEffect, useState } from 'react';
import { RunnerGame } from '@/components/RunnerGame/RunnerGame';
import { motion } from 'framer-motion';
import { LogoSvg } from '@/components/Logo/LogoSvg';

interface GameGateProps {
  children: React.ReactNode;
}

export const GameGate: React.FC<GameGateProps> = ({ children }) => {
  const [gameUnlocked, setGameUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    // Check localStorage for game unlock state
    const isUnlocked = localStorage.getItem('gameUnlocked');
    if (isUnlocked === 'true') {
      setGameUnlocked(true);
    }
    setLoading(false);
  }, []);

  const handleGameWon = () => {
    localStorage.setItem('gameUnlocked', 'true');
    setShowReplay(true);
    // Delay unlock so the ACCESS GRANTED overlay plays out
    setTimeout(() => setGameUnlocked(true), 2600);
  };

  const handleReplay = () => {
    localStorage.removeItem('gameUnlocked');
    setGameUnlocked(false);
    setShowReplay(false);
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-[#0a0e27] to-[#1a1f3a]'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <LogoSvg size={80} />
        </motion.div>
      </div>
    );
  }

  if (!gameUnlocked) {
    return (
      <div className='fixed inset-0 z-100 flex flex-col items-center justify-center overflow-y-auto bg-linear-to-br from-[#0a0e27] to-[#1a1f3a] p-4'>
        {/* Background effects */}
        <div className='pointer-events-none fixed inset-0 overflow-hidden'>
          <div className='absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl' />
          <div className='absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-400/5 blur-3xl' />
        </div>

        <div className='relative z-10 w-full max-w-2xl'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='mb-4 text-center sm:mb-8'
          >
            <div className='mb-8 flex justify-center'>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <LogoSvg size={100} animated />
              </motion.div>
            </div>

            <h1 className='mb-4 font-mono text-4xl font-black tracking-tighter md:text-5xl'>
              <span className='text-cyan-400'>JOSHUA</span>
              <span className='mx-2 text-purple-400'>SILVA</span>
            </h1>

            <p className='mb-2 font-mono text-lg text-green-400'>
              Full Stack Developer | Digital Universe
            </p>

            <p className='font-mono text-sm text-cyan-400/70'>
              Complete the game to unlock access to the portfolio
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='rounded-2xl border border-cyan-400/30 bg-black/40 p-3 shadow-2xl backdrop-blur-md sm:p-8'
            style={{
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
            }}
          >
            <RunnerGame onGameWon={handleGameWon} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className='mt-6 space-y-2 text-center font-mono text-[11px] text-gray-400 sm:mt-8 sm:text-xs'
          >
            <p>Move mouse · Drag finger · Fly through the gaps</p>
            <p className='text-cyan-400/50'>
              Score 50pts to unlock the portfolio
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Game unlocked - show portfolio with replay option
  return (
    <>
      {children}

      {showReplay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='fixed right-4 bottom-4 z-50 sm:right-8 sm:bottom-8'
        >
          <button
            onClick={handleReplay}
            className='rounded-lg bg-linear-to-r from-cyan-500 to-purple-500 px-6 py-3 font-mono font-bold text-white transition-all hover:shadow-lg'
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)',
            }}
          >
            ↻ Replay Game
          </button>
        </motion.div>
      )}
    </>
  );
};
