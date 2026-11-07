'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Topographic contour lines, loosely shaped like a Front Range summit.
 * Deterministic (no randomness) so server and client render identically.
 * This is the site's one orchestrated motion moment: lines draw in once.
 */

type Pt = [number, number];

function ring(level: number, cx: number, cy: number): Pt[] {
  const pts: Pt[] = [];
  const steps = 48;
  const base = 26 + level * 30;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    // layered harmonics give an organic, ridge-like outline
    const wobble =
      1 +
      0.16 * Math.sin(a * 2 + level * 0.35) +
      0.08 * Math.sin(a * 3 - level * 0.6) +
      0.05 * Math.cos(a * 5 + level * 0.9);
    const r = base * wobble;
    // stretch horizontally and lean the summit to the upper left
    pts.push([cx + Math.cos(a) * r * 1.35 - level * 4, cy + Math.sin(a) * r * 0.9 + level * 3]);
  }
  return pts;
}

function smoothPath(pts: Pt[]): string {
  const n = pts.length;
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(pts[0][0])},${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])},${f(c1[1])} ${f(c2[0])},${f(c2[1])} ${f(p2[0])},${f(p2[1])}`;
  }
  return `${d} Z`;
}

const PATHS = Array.from({ length: 11 }, (_, i) => smoothPath(ring(i, 300, 210)));

export function Contour({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox='0 0 600 460'
      className={className}
      aria-hidden
      focusable='false'
      preserveAspectRatio='xMidYMid slice'
    >
      {PATHS.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill='none'
          stroke='currentColor'
          strokeWidth={i === 3 ? 1.4 : 0.9}
          strokeOpacity={i === 3 ? 0.75 : 0.22 + (i % 3) * 0.06}
          // `initial` must be identical on server and client (the server can't know the
          // visitor's motion setting), so reduced motion only changes the timing: lines appear instantly.
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 1.8, delay: 0.15 + i * 0.07, ease: [0.4, 0, 0.2, 1] }}
        />
      ))}
    </svg>
  );
}
