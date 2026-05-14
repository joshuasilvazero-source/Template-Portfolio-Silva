'use client';

import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (isMobile) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf: number;
    let hovered = false;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      if (dotRef.current) {
        dotRef.current.style.transform  = `translate(${mx - 4}px, ${my - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px) scale(${hovered ? 1.6 : 1})`;
      }
    };

    const onEnter = () => { hovered = true; };
    const onLeave = () => { hovered = false; };

    const bindHovers = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    window.addEventListener('mousemove', onMove);
    loop();
    bindHovers();

    // Re-bind after dynamic content changes
    const obs = new MutationObserver(bindHovers);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className='pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-blue-400'
        style={{
          boxShadow: '0 0 10px rgba(96,165,250,0.9), 0 0 20px rgba(96,165,250,0.4)',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className='pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 rounded-full border border-blue-400/35 transition-transform duration-200'
        style={{ willChange: 'transform' }}
      />
    </>
  );
};
