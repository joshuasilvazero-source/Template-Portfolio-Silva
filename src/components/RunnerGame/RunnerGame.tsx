'use client';
import React, { useEffect, useRef } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const W = 800, H = 400;
const SHIP_X    = 140;
const SHW = 24, SHH = 10;
const WIN_SCORE = 100;
const SPD       = 4.2;          // constant cruise speed

// ── Sound ─────────────────────────────────────────────────────────────────────
function tone(hz: number, ms: number, type: OscillatorType = 'sine', vol = 0.055) {
  try {
    const ac = new AudioContext();
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    o.type = type; o.frequency.value = hz;
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + ms / 1000);
    o.start(); o.stop(ac.currentTime + ms / 1000);
  } catch (_) {}
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Star  { x: number; y: number; r: number; a: number; phase: number }
interface Prtcl { x: number; y: number; vx: number; vy: number; life: number; max: number; clr: string; r: number }
interface Trail { x: number; y: number; r: number; a: number }
type GS = 'idle' | 'playing' | 'won';

interface GameState {
  gs: GS; score: number;
  sy: number;                    // vertical position (sinusoidal)
  farStars: Star[]; midStars: Star[]; nearStars: Star[];
  bx1: number; bx2: number; bx3: number;
  ptcl: Prtcl[];
  trail: Trail[];
  frame: number;
  accessT: number;
}

// ── Star helpers ──────────────────────────────────────────────────────────────
function mkStars(n: number, rMin: number, rMax: number): Star[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: rMin + Math.random() * (rMax - rMin),
    a: 0.3 + Math.random() * 0.7,
    phase: Math.random() * Math.PI * 2,
  }));
}

function wrapX(x: number, bx: number): number {
  return (((x - bx % W) % W) + W) % W;
}

// ── Draw: nebula clouds ───────────────────────────────────────────────────────
function drawNebula(ctx: CanvasRenderingContext2D, bx: number) {
  const drift = bx * 0.012;
  const blobs = [
    { vx: 180, vy: 110, rx: 240, ry: 100, c: 'rgba(50,0,110,0.07)' },
    { vx: 560, vy: 280, rx: 210, ry:  95, c: 'rgba(0,40,130,0.06)' },
    { vx: 380, vy: 200, rx: 190, ry: 115, c: 'rgba(100,0,60,0.05)' },
  ];
  for (const b of blobs) {
    const bxn = (((b.vx - drift) % (W + 300)) + W + 300) % (W + 300) - 150;
    const grd = ctx.createRadialGradient(bxn, b.vy, 0, bxn, b.vy, b.rx);
    grd.addColorStop(0, b.c);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save();
    ctx.scale(1, b.ry / b.rx);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(bxn, b.vy * (b.rx / b.ry), b.rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ── Draw: star layer ──────────────────────────────────────────────────────────
function drawStars(ctx: CanvasRenderingContext2D, stars: Star[], bx: number, frame: number) {
  for (const s of stars) {
    const x = wrapX(s.x, bx);
    const tw = s.a * (0.65 + 0.35 * Math.sin(frame * 0.04 + s.phase));
    ctx.globalAlpha = tw;
    ctx.fillStyle = '#c8d8ff';
    ctx.beginPath(); ctx.arc(x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── Draw: spacecraft ──────────────────────────────────────────────────────────
function drawShip(ctx: CanvasRenderingContext2D, sy: number, frame: number) {
  const x = SHIP_X, y = sy;
  ctx.save();

  // Engine exhaust
  const exhaustLen = 26 + Math.sin(frame * 0.35) * 8;
  const jitter     = Math.sin(frame * 0.5) * 2;
  const eg1 = ctx.createLinearGradient(x - SHW, y, x - SHW - exhaustLen, y);
  eg1.addColorStop(0, 'rgba(20,100,220,0.6)');
  eg1.addColorStop(0.45, 'rgba(0,50,150,0.2)');
  eg1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = eg1;
  ctx.beginPath();
  ctx.moveTo(x - SHW, y - 6);
  ctx.lineTo(x - SHW - exhaustLen, y + jitter);
  ctx.lineTo(x - SHW, y + 6);
  ctx.closePath(); ctx.fill();

  // Wings
  const wg = ctx.createLinearGradient(x - 4, y, x - SHW - 6, y + SHH + 20);
  wg.addColorStop(0, '#1a3560'); wg.addColorStop(1, '#0b1a30');
  ctx.fillStyle = wg;
  ctx.shadowColor = '#0055aa'; ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(x - 2, y - 5); ctx.lineTo(x - 8, y - SHH - 1);
  ctx.lineTo(x - SHW - 4, y - SHH - 19); ctx.lineTo(x - SHW, y - SHH - 14);
  ctx.lineTo(x - 10, y - SHH + 3); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 2, y + 5); ctx.lineTo(x - 8, y + SHH + 1);
  ctx.lineTo(x - SHW - 4, y + SHH + 19); ctx.lineTo(x - SHW, y + SHH + 14);
  ctx.lineTo(x - 10, y + SHH - 3); ctx.closePath(); ctx.fill();

  // Fuselage
  const bg = ctx.createLinearGradient(x - SHW, y - SHH, x + SHW, y + SHH);
  bg.addColorStop(0, '#1e4070'); bg.addColorStop(0.45, '#2a60a8'); bg.addColorStop(1, '#0d1e38');
  ctx.fillStyle = bg;
  ctx.shadowColor = '#0066cc'; ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(x + SHW, y);
  ctx.lineTo(x + SHW - 10, y - SHH + 2); ctx.lineTo(x - SHW + 14, y - SHH);
  ctx.lineTo(x - SHW, y - 5); ctx.lineTo(x - SHW, y + 5);
  ctx.lineTo(x - SHW + 14, y + SHH); ctx.lineTo(x + SHW - 10, y + SHH - 2);
  ctx.closePath(); ctx.fill();

  // Cockpit
  const cg = ctx.createRadialGradient(x + 6, y - 2, 0, x + 6, y, 9);
  cg.addColorStop(0, 'rgba(170,235,255,0.95)');
  cg.addColorStop(0.55, 'rgba(0,170,255,0.75)');
  cg.addColorStop(1, 'rgba(0,70,140,0.3)');
  ctx.fillStyle = cg;
  ctx.shadowColor = '#00ddff'; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.ellipse(x + 6, y, 11, SHH - 1, 0.12, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ── Draw: particle ────────────────────────────────────────────────────────────
function drawPrtcl(ctx: CanvasRenderingContext2D, p: Prtcl) {
  const a = p.life / p.max;
  ctx.save(); ctx.globalAlpha = a;
  ctx.shadowColor = p.clr; ctx.shadowBlur = 6;
  ctx.fillStyle = p.clr;
  ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ── Draw: HUD ─────────────────────────────────────────────────────────────────
function drawHUD(ctx: CanvasRenderingContext2D, score: number, scale: number) {
  const sf = (n: number, min = 7) => Math.round(Math.max(min / scale, n));
  ctx.save();

  ctx.font = `bold ${sf(13, 9)}px monospace`;
  ctx.shadowColor = '#00aaff'; ctx.shadowBlur = 8;
  ctx.fillStyle = '#00aaff'; ctx.textAlign = 'left';
  ctx.fillText(`DIST: ${Math.floor(score)}m`, 12, 24);

  const bW = 200, bH = 7, bX = (W - bW) / 2, bY = 13;
  const prog = Math.min(score / WIN_SCORE, 1);
  ctx.shadowBlur = 0; ctx.fillStyle = '#000d22';
  ctx.fillRect(bX, bY, bW, bH);
  if (prog > 0) {
    const pg = ctx.createLinearGradient(bX, 0, bX + bW, 0);
    pg.addColorStop(0, '#0077ff'); pg.addColorStop(0.6, '#00ccff'); pg.addColorStop(1, '#8800ff');
    ctx.fillStyle = pg; ctx.shadowColor = '#0099ff'; ctx.shadowBlur = 8;
    ctx.fillRect(bX, bY, bW * prog, bH);
  }
  ctx.shadowBlur = 0; ctx.strokeStyle = '#003366'; ctx.lineWidth = 1;
  ctx.strokeRect(bX, bY, bW, bH);
  ctx.font = `${sf(9, 7)}px monospace`; ctx.fillStyle = '#0066aa66';
  ctx.fillText(`/${WIN_SCORE}m`, bX + bW + 5, bY + 7);

  ctx.restore();
}

// ── Draw: overlay screens ─────────────────────────────────────────────────────
function drawOverlay(ctx: CanvasRenderingContext2D, gs: GS, score: number, accessT: number, scale: number) {
  const sf = (n: number, min = 8) => Math.round(Math.max(min / scale, n));
  ctx.save();
  ctx.fillStyle = 'rgba(0,4,18,0.86)'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  const cx = W / 2;

  if (gs === 'idle') {
    for (let y = 0; y < H; y += 4) {
      ctx.globalAlpha = 0.03; ctx.fillStyle = '#0055ff';
      ctx.fillRect(0, y, W, 1);
    }
    ctx.globalAlpha = 1;
    ctx.font = `bold ${sf(32, 16)}px monospace`;
    ctx.shadowColor = '#0077ff'; ctx.shadowBlur = 32;
    ctx.fillStyle = '#00aaff';
    ctx.fillText('INTERSTELLAR CRUISE', cx, H / 2 - 48);
    ctx.font = `${sf(11, 8)}px monospace`;
    ctx.shadowBlur = 0; ctx.fillStyle = '#005588';
    ctx.fillText('embark on a voyage through the cosmos', cx, H / 2 - 16);
    ctx.font = `bold ${sf(13, 9)}px monospace`;
    ctx.shadowColor = '#6600ff'; ctx.shadowBlur = 14;
    ctx.fillStyle = '#aa44ff';
    ctx.fillText('[ TAP  /  CLICK  /  SPACE  =  LAUNCH ]', cx, H / 2 + 18);
    ctx.font = `${sf(10, 7)}px monospace`;
    ctx.shadowBlur = 0; ctx.fillStyle = '#003355aa';
    ctx.fillText(`travel ${WIN_SCORE}m through the galaxy to unlock the portfolio`, cx, H / 2 + 48);

  } else if (gs === 'won') {
    const a = Math.min(accessT / 45, 1);
    ctx.globalAlpha = a;
    for (let y = 0; y < H; y += 3) {
      ctx.globalAlpha = a * 0.04; ctx.fillStyle = '#0044ff';
      ctx.fillRect(0, y, W, 1);
    }
    ctx.globalAlpha = a;
    ctx.font = `bold ${sf(38, 16)}px monospace`;
    ctx.shadowColor = '#0088ff'; ctx.shadowBlur = 44;
    ctx.fillStyle = '#00ccff';
    ctx.fillText('WARP ACHIEVED', cx, H / 2 - 52);
    ctx.font = `${sf(15, 11)}px monospace`;
    ctx.shadowColor = '#8800ff'; ctx.shadowBlur = 12;
    ctx.fillStyle = '#aa44ff';
    ctx.fillText(`DISTANCE: ${score}m`, cx, H / 2 - 2);
    ctx.font = `${sf(12, 9)}px monospace`;
    ctx.shadowBlur = 5; ctx.fillStyle = '#ffffff';
    ctx.fillText('PORTFOLIO UNLOCKING...', cx, H / 2 + 40);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// ── Main draw ─────────────────────────────────────────────────────────────────
function draw(ctx: CanvasRenderingContext2D, s: GameState) {
  const scale = Math.min(1, Math.max(0.1, (ctx.canvas.clientWidth || W) / W));

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#000308'); sky.addColorStop(1, '#010614');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  drawNebula(ctx, s.bx1);
  drawStars(ctx, s.farStars,  s.bx1, s.frame);
  drawStars(ctx, s.midStars,  s.bx2, s.frame);
  drawStars(ctx, s.nearStars, s.bx3, s.frame);

  for (const p of s.ptcl) drawPrtcl(ctx, p);

  for (const t of s.trail) {
    ctx.save(); ctx.globalAlpha = t.a;
    ctx.shadowColor = '#0077ff'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#0055cc';
    ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  if (s.gs !== 'idle') drawShip(ctx, s.sy, s.frame);
  if (s.gs === 'playing') drawHUD(ctx, s.score, scale);
  if (s.gs !== 'playing') drawOverlay(ctx, s.gs, Math.floor(s.score), s.accessT, scale);
}

// ── Component ─────────────────────────────────────────────────────────────────
interface RunnerGameProps { onGameWon?: () => void }

export const RunnerGame: React.FC<RunnerGameProps> = ({ onGameWon }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<GameState | null>(null);
  const animRef   = useRef<number>(0);
  const wonRef    = useRef(onGameWon);
  useEffect(() => { wonRef.current = onGameWon; }, [onGameWon]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const baseF = mkStars(80, 0.4, 1.0);
    const baseM = mkStars(40, 0.9, 1.7);
    const baseN = mkStars(18, 1.6, 2.8);

    const makeState = (): GameState => ({
      gs: 'idle', score: 0,
      sy: H / 2,
      farStars: baseF, midStars: baseM, nearStars: baseN,
      bx1: 0, bx2: 0, bx3: 0,
      ptcl: [], trail: [],
      frame: 0, accessT: 0,
    });

    stateRef.current = makeState();

    function addPtcl(x: number, y: number, n: number, clr: string, spd: number, r: number, life: number) {
      const s = stateRef.current!;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = Math.random() * spd;
        s.ptcl.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - spd * 0.3, life, max: life, clr, r });
      }
    }

    function doStart() {
      const st = makeState();
      st.gs = 'playing';
      stateRef.current = st;
      tone(500, 100, 'sine', 0.06);
    }

    function handleInput() {
      if (stateRef.current!.gs === 'idle') doStart();
    }

    const handleKey   = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); handleInput(); } };
    const handleClick = () => handleInput();
    const handleTouch = (e: TouchEvent) => { e.preventDefault(); handleInput(); };

    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    const loop = () => {
      const s = stateRef.current!;
      s.frame++;

      if (s.gs === 'playing') {
        // Sinusoidal cruise — no gravity, no obstacles
        s.sy = H / 2 + Math.sin(s.frame * 0.022) * 70;

        // Scroll background layers
        s.bx1 += SPD * 0.09;
        s.bx2 += SPD * 0.24;
        s.bx3 += SPD * 0.58;

        // Auto-increment distance
        s.score += SPD / 72;

        if (s.score >= WIN_SCORE) {
          s.score = WIN_SCORE;
          s.gs = 'won'; s.accessT = 0;
          tone(880, 320, 'sine', 0.08);
          setTimeout(() => tone(1100, 320, 'sine', 0.08), 330);
          setTimeout(() => tone(1320, 500, 'sine', 0.08), 670);
          wonRef.current?.();
        }

        // Engine trail
        if (s.frame % 2 === 0) {
          s.trail.push({
            x: SHIP_X - SHW - 2 + (Math.random() - 0.5) * 5,
            y: s.sy + (Math.random() - 0.5) * 7,
            r: 3.5 + Math.random() * 2,
            a: 0.55,
          });
        }
        s.trail = s.trail.filter(t => { t.a -= 0.045; t.r *= 0.91; return t.a > 0.01; });

        // Periodic sparkle bursts
        if (s.frame % 90 === 0) {
          addPtcl(SHIP_X + 24, s.sy, 5, '#00aaff', 3.5, 2.5, 22);
        }

        s.ptcl = s.ptcl.filter(p => { p.x += p.vx; p.y += p.vy; return --p.life > 0; });
      }

      if (s.gs === 'won') s.accessT++;

      draw(ctx, s);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: `${W}px`, aspectRatio: `${W}/${H}` }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: '100%', height: '100%', display: 'block',
          borderRadius: '10px',
          border: '1px solid rgba(0,120,255,0.28)',
          boxShadow: '0 0 30px rgba(0,80,255,0.2), 0 0 60px rgba(80,0,200,0.1)',
        }}
      />
    </div>
  );
};
