import '@/styles/animate.css';
import '@/styles/prism-vsc-dark-plus.css';
import '@/styles/star.css';
import '@/styles/tailwind.css';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { GameGate } from '@/components/GameGate/GameGate';
import ThreeBackground from '@/components/ThreeBackground/ThreeBackground';
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen';
import { Space_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'react-hot-toast';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${spaceMono.className} min-h-screen overflow-x-clip bg-[#000510] text-white`}
    >
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.6)); }
          50%       { filter: drop-shadow(0 0 16px rgba(168, 85, 247, 0.8)); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-orbit { animation: orbit-spin 12s linear infinite; }

        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .animate-float { animation: float-y 5s ease-in-out infinite; }

        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline { animation: scanline 8s linear infinite; }

        ::selection { background: rgba(0, 229, 255, 0.25); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000510; }
        ::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.35); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(45, 212, 191, 0.65); }
      `}</style>

      <LoadingScreen />

      <div className='relative isolate overflow-x-clip'>
        <ThreeBackground />

        {/* Subtle global scanline */}
        <div
          aria-hidden
          className='pointer-events-none fixed inset-x-0 top-0 z-1 h-0.5 w-full bg-linear-to-r from-transparent via-cyan-400/[0.07] to-transparent scanline'
        />

        <NextTopLoader
          color='#00e5ff'
          crawlSpeed={300}
          showSpinner={false}
          shadow='0 0 10px rgba(0,229,255,0.5)'
        />

        <Toaster
          position='top-right'
          toastOptions={{
            style: {
              background: 'rgba(0,5,16,0.9)',
              border: '1px solid rgba(45,212,191,0.22)',
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontSize: '12px',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
        <Navbar />

        <GameGate>
          {children}
          <Footer />
        </GameGate>
      </div>
    </div>
  );
}
