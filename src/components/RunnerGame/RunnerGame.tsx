'use client';
import React, { useEffect, useRef } from 'react';

// ── Constants ─────────────────────────────────────────────────────────────────
const W = 800, H = 400;
const SHIP_X = 140;
const SHW = 24, SHH = 10;   // ship hitbox half-dimensions
const BOOST_VY  = -6.2;
const GRAVITY   = 0.30;
const MAX_VY    = 9;
const WIN_SCORE = 100;
const SCORE_PER_GATE = 10;
const LIVES_START = 3;
const INV_FRAMES = 80;
const GAP_START = 178;
const GAP_MIN   = 115;
const GATE_HW   = 26;        // gate hitbox half-width
const SPD_START = 3.6;
const SPD_MAX   = 10;

// ── Seeded PRNG (xorshift32) ───────────────────────────────────────────────────
function mkRng(seed: number) {
  let s = (seed | 0) || 1;
  return () => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

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
interface Gate  { x: number; mid: number; gap: number; passed: boolean; seed: number }
interface Chunk { x: number; y: number; r: number; rot: number; rv: number; spd: number; sides: number }
interface Prtcl { x: number; y: number; vx: number; vy: number; life: number; max: number; clr: string; r: number }
interface Trail { x: number; y: number; r: number; a: number }
type GS = 'idle' | 'playing' | 'gameOver' | 'won';

interface GameState {
  gs: GS; score: number;
  sy: number; svy: number;
  farStars: Star[]; midStars: Star[]; nearStars: Star[];
  bx1: number; bx2: number; bx3: number;
  gates: Gate[];
  chunks: Chunk[];
  ptcl: Prtcl[];
  trail: Trail[];
  spawnT: number; graceT: number; chunkT: number;
  spd: number; frame: number;
  lives: number; inv: number; accessT: number;
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

// ── Draw: irregular rock polygon ──────────────────────────────────────────────
function drawRock(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  rng: () => number,
  fill: string, stroke: string,
) {
  const sides = 7 + Math.floor(rng() * 4);
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const pr = r * (0.58 + rng() * 0.52);
    const px = cx + Math.cos(angle) * pr;
    const py = cy + Math.sin(angle) * pr;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke();
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

// ── Draw: one gate wall (asteroid formation) ──────────────────────────────────
function drawGateWall(
  ctx: CanvasRenderingContext2D,
  gx: number, y0: number, y1: number,
  seed: number, isTop: boolean,
) {
  if (y1 <= y0) return;
  const rng  = mkRng(seed);
  const h    = y1 - y0;
  const visW = GATE_HW * 2 + 8;

  // Dark base slab
  ctx.fillStyle = '#080c18';
  ctx.fillRect(gx - GATE_HW - 4, y0, visW, h);

  // Rock chunks for texture
  const count = Math.floor(h / 30) + 3;
  for (let i = 0; i < count; i++) {
    const cx = gx - GATE_HW + rng() * GATE_HW * 2;
    const cy = y0 + rng() * h;
    const r  = 13 + rng() * 24;
    ctx.save();
    ctx.shadowColor = '#1a2540'; ctx.shadowBlur = 5;
    drawRock(ctx, cx, cy, r, mkRng(seed * 31 + i * 17), '#12182c', '#1e2c46');
    if (rng() > 0.5) {
      drawRock(ctx, cx + rng() * 12 - 6, cy + rng() * 12 - 6, r * 0.48, mkRng(seed + i * 99), '#0c0f1c', '#181e30');
    }
    ctx.restore();
  }

  // Glowing edge at the gap face
  const edgeY = isTop ? y1 : y0;
  const grad  = ctx.createLinearGradient(gx, edgeY, gx, edgeY + (isTop ? -34 : 34));
  grad.addColorStop(0,   'rgba(255,110,20,0.55)');
  grad.addColorStop(0.5, 'rgba(200,50,0,0.18)');
  grad.addColorStop(1,   'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(gx - GATE_HW - 4, isTop ? y1 - 34 : y0, visW, 34);

  // Orange edge line
  ctx.save();
  ctx.strokeStyle = 'rgba(255,130,40,0.65)';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = '#ff6600'; ctx.shadowBlur = 9;
  ctx.beginPath();
  ctx.moveTo(gx - GATE_HW - 4, edgeY);
  ctx.lineTo(gx + GATE_HW + 4, edgeY);
  ctx.stroke();
  ctx.restore();
}

function drawGate(ctx: CanvasRenderingContext2D, g: Gate) {
  const top = g.mid - g.gap / 2;
  const bot = g.mid + g.gap / 2;
  ctx.save();
  drawGateWall(ctx, g.x, 0,   top, g.seed,        true);
  drawGateWall(ctx, g.x, bot, H,   g.seed + 5003,  false);
  ctx.restore();
}

// ── Draw: spacecraft ──────────────────────────────────────────────────────────
function drawShip(ctx: CanvasRenderingContext2D, sy: number, frame: number, inv: number, boosting: boolean) {
  if (inv > 0 && Math.floor(inv / 5) % 2 === 0) return;
  const x = SHIP_X, y = sy;
  ctx.save();

  // Engine exhaust cone
  const exhaustLen = 26 + Math.sin(frame * 0.35) * 8 + (boosting ? 20 : 0);
  const jitter     = Math.sin(frame * 0.5) * 2;
  const eg1 = ctx.createLinearGradient(x - SHW, y, x - SHW - exhaustLen, y);
  eg1.addColorStop(0, boosting ? 'rgba(30,160,255,0.95)' : 'rgba(20,100,220,0.6)');
  eg1.addColorStop(0.45, boosting ? 'rgba(0,80,200,0.35)' : 'rgba(0,50,150,0.2)');
  eg1.addColorStop(1, 'rgba(0,0,0,0)');
  const ew = boosting ? 9 : 6;
  ctx.fillStyle = eg1;
  ctx.beginPath();
  ctx.moveTo(x - SHW, y - ew);
  ctx.lineTo(x - SHW - exhaustLen, y + jitter);
  ctx.lineTo(x - SHW, y + ew);
  ctx.closePath(); ctx.fill();

  // Secondary smaller exhaust
  const eg2 = ctx.createLinearGradient(x - SHW + 2, y + 4, x - SHW - exhaustLen * 0.55, y + 4);
  eg2.addColorStop(0, boosting ? 'rgba(80,200,255,0.8)' : 'rgba(40,130,220,0.4)');
  eg2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = eg2;
  ctx.beginPath();
  ctx.moveTo(x - SHW + 2, y + 1);
  ctx.lineTo(x - SHW - exhaustLen * 0.55, y + 3 + jitter * 0.6);
  ctx.lineTo(x - SHW + 2, y + 6);
  ctx.closePath(); ctx.fill();

  // Wings (swept back, extending above/below fuselage)
  const wg = ctx.createLinearGradient(x - 4, y, x - SHW - 6, y + SHH + 20);
  wg.addColorStop(0, '#1a3560'); wg.addColorStop(1, '#0b1a30');
  ctx.fillStyle = wg;
  ctx.shadowColor = '#0055aa'; ctx.shadowBlur = 12;

  // Upper wing
  ctx.beginPath();
  ctx.moveTo(x - 2,       y - 5);
  ctx.lineTo(x - 8,       y - SHH - 1);
  ctx.lineTo(x - SHW - 4, y - SHH - 19);
  ctx.lineTo(x - SHW,     y - SHH - 14);
  ctx.lineTo(x - 10,      y - SHH + 3);
  ctx.closePath(); ctx.fill();

  // Lower wing
  ctx.beginPath();
  ctx.moveTo(x - 2,       y + 5);
  ctx.lineTo(x - 8,       y + SHH + 1);
  ctx.lineTo(x - SHW - 4, y + SHH + 19);
  ctx.lineTo(x - SHW,     y + SHH + 14);
  ctx.lineTo(x - 10,      y + SHH - 3);
  ctx.closePath(); ctx.fill();

  // Wing accent lines
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(60,140,255,0.35)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x - 6, y - 8);  ctx.lineTo(x - SHW, y - SHH - 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 6, y + 8);  ctx.lineTo(x - SHW, y + SHH + 10); ctx.stroke();

  // Main fuselage
  const bg = ctx.createLinearGradient(x - SHW, y - SHH, x + SHW, y + SHH);
  bg.addColorStop(0, '#1e4070'); bg.addColorStop(0.45, '#2a60a8'); bg.addColorStop(1, '#0d1e38');
  ctx.fillStyle = bg;
  ctx.shadowColor = '#0066cc'; ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(x + SHW,      y);
  ctx.lineTo(x + SHW - 10, y - SHH + 2);
  ctx.lineTo(x - SHW + 14, y - SHH);
  ctx.lineTo(x - SHW,      y - 5);
  ctx.lineTo(x - SHW,      y + 5);
  ctx.lineTo(x - SHW + 14, y + SHH);
  ctx.lineTo(x + SHW - 10, y + SHH - 2);
  ctx.closePath(); ctx.fill();

  // Hull stripe lines
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(100,180,255,0.32)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x + SHW - 12, y - SHH + 4); ctx.lineTo(x - SHW + 16, y - SHH + 3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + SHW - 12, y + SHH - 4); ctx.lineTo(x - SHW + 16, y + SHH - 3); ctx.stroke();

  // Cockpit canopy
  const cg = ctx.createRadialGradient(x + 6, y - 2, 0, x + 6, y, 9);
  cg.addColorStop(0,    'rgba(170,235,255,0.95)');
  cg.addColorStop(0.55, 'rgba(0,170,255,0.75)');
  cg.addColorStop(1,    'rgba(0,70,140,0.3)');
  ctx.fillStyle = cg;
  ctx.shadowColor = '#00ddff'; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.ellipse(x + 6, y, 11, SHH - 1, 0.12, 0, Math.PI * 2); ctx.fill();

  // Cockpit reflection highlight
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.ellipse(x + 9, y - 2, 4, 2, 0.25, 0, Math.PI * 2); ctx.fill();

  // Engine ports glow
  ctx.fillStyle = boosting ? '#40c0ff' : '#001e3a';
  ctx.shadowColor = boosting ? '#00ccff' : 'transparent';
  ctx.shadowBlur  = boosting ? 12 : 0;
  ctx.fillRect(x - SHW - 1, y - 5, 5, 4);
  ctx.fillRect(x - SHW - 1, y + 1, 5, 4);

  ctx.restore();
}

// ── Draw: floating debris ─────────────────────────────────────────────────────
function drawChunk(ctx: CanvasRenderingContext2D, c: Chunk) {
  ctx.save();
  ctx.translate(c.x, c.y); ctx.rotate(c.rot);
  ctx.shadowColor = '#1a2233'; ctx.shadowBlur = 4;
  drawRock(ctx, 0, 0, c.r, mkRng(c.sides * 991 + Math.round(c.r * 10)), '#131820', '#202840');
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
function drawHUD(ctx: CanvasRenderingContext2D, score: number, lives: number, scale: number) {
  const sf = (n: number, min = 7) => Math.round(Math.max(min / scale, n));
  ctx.save();

  ctx.font = `bold ${sf(13, 9)}px monospace`;
  ctx.shadowColor = '#00aaff'; ctx.shadowBlur = 8;
  ctx.fillStyle = '#00aaff'; ctx.textAlign = 'left';
  ctx.fillText(`DIST: ${score}`, 12, 24);

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
  ctx.fillText(`/${WIN_SCORE}`, bX + bW + 5, bY + 7);

  ctx.textAlign = 'right';
  for (let i = 0; i < LIVES_START; i++) {
    const on = i < lives;
    ctx.fillStyle = on ? '#00aaff' : '#001a33';
    ctx.shadowColor = on ? '#0088ff' : 'transparent';
    ctx.shadowBlur  = on ? 8 : 0;
    ctx.font = `${sf(14, 10)}px monospace`;
    ctx.fillText('◆', W - 12 - i * 22, 24);
  }
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
    ctx.fillText('INTERSTELLAR RUNNER', cx, H / 2 - 54);
    ctx.font = `${sf(11, 8)}px monospace`;
    ctx.shadowBlur = 0; ctx.fillStyle = '#005588';
    ctx.fillText('navigate the asteroid field to unlock the portfolio', cx, H / 2 - 24);
    ctx.font = `bold ${sf(13, 9)}px monospace`;
    ctx.shadowColor = '#6600ff'; ctx.shadowBlur = 14;
    ctx.fillStyle = '#aa44ff';
    ctx.fillText('[ TAP  /  CLICK  /  SPACE  =  THRUSTER BOOST ]', cx, H / 2 + 8);
    ctx.font = `${sf(10, 7)}px monospace`;
    ctx.shadowBlur = 0; ctx.fillStyle = '#003355aa';
    ctx.fillText(`◆ ${LIVES_START} shields  •  gap narrows with speed  •  reach ${WIN_SCORE} to warp`, cx, H / 2 + 38);

  } else if (gs === 'gameOver') {
    ctx.font = `bold ${sf(36, 16)}px monospace`;
    ctx.shadowColor = '#cc2200'; ctx.shadowBlur = 32;
    ctx.fillStyle = '#ff4422';
    ctx.fillText('HULL BREACH', cx, H / 2 - 46);
    ctx.font = `${sf(15, 10)}px monospace`;
    ctx.shadowColor = '#0088ff'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#00aaff';
    ctx.fillText(`DISTANCE: ${score} / ${WIN_SCORE}`, cx, H / 2 - 4);
    ctx.font = `bold ${sf(13, 9)}px monospace`;
    ctx.shadowColor = '#6600ff'; ctx.shadowBlur = 12;
    ctx.fillStyle = '#aa44ff';
    ctx.fillText('[ RETRY: TAP / CLICK / SPACE ]', cx, H / 2 + 34);

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
    ctx.fillText(`DISTANCE: ${score}`, cx, H / 2 - 2);
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

  for (const c of s.chunks) drawChunk(ctx, c);
  for (const p of s.ptcl)   drawPrtcl(ctx, p);

  for (const t of s.trail) {
    ctx.save(); ctx.globalAlpha = t.a;
    ctx.shadowColor = '#0077ff'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#0055cc';
    ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  for (const g of s.gates) drawGate(ctx, g);

  if (s.gs !== 'idle') {
    const boosting = s.gs === 'playing' && s.svy < -1;
    drawShip(ctx, s.sy, s.frame, s.inv, boosting);
  }

  if (s.gs === 'playing') drawHUD(ctx, s.score, s.lives, scale);
  if (s.gs !== 'playing') drawOverlay(ctx, s.gs, s.score, s.accessT, scale);
}

// ── Component ─────────────────────────────────────────────────────────────────
interface RunnerGameProps { onGameWon?: () => void }

export const RunnerGame: React.FC<RunnerGameProps> = ({ onGameWon }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<GameState | null>(null);
  const animRef   = useRef<number>(0);
  const wonRef    = useRef(onGameWon);
  const seedRef   = useRef(0);
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
      sy: H / 2, svy: 0,
      farStars: baseF, midStars: baseM, nearStars: baseN,
      bx1: 0, bx2: 0, bx3: 0,
      gates: [], chunks: [], ptcl: [], trail: [],
      spawnT: 0, graceT: 70, chunkT: 0,
      spd: SPD_START, frame: 0,
      lives: LIVES_START, inv: 0, accessT: 0,
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

    function doBoost() {
      const s = stateRef.current!;
      if (s.gs !== 'playing') return;
      s.svy = BOOST_VY;
      tone(520, 70, 'sine', 0.05);
      addPtcl(SHIP_X - SHW - 4, s.sy, 5, '#0088ff', 3.5, 2.5, 18);
    }

    function doStart() {
      const st = makeState();
      st.gs = 'playing';
      stateRef.current = st;
      tone(500, 100, 'sine', 0.06);
    }

    function handleInput() {
      const gs = stateRef.current!.gs;
      if (gs === 'idle' || gs === 'gameOver') doStart();
      else if (gs === 'playing') doBoost();
    }

    const handleKey   = (e: KeyboardEvent) => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); handleInput(); } };
    const handleClick = () => { if (stateRef.current!.gs !== 'won') handleInput(); };
    const handleTouch = (e: TouchEvent) => { e.preventDefault(); handleInput(); };

    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    const loop = () => {
      const s = stateRef.current!;
      s.frame++;

      if (s.gs === 'playing') {
        // Physics
        s.svy = Math.max(-MAX_VY, Math.min(MAX_VY, s.svy + GRAVITY));
        s.sy  = Math.max(SHH + 2, Math.min(H - SHH - 2, s.sy + s.svy));

        // Edge collision (top / bottom boundary)
        if ((s.sy <= SHH + 3 || s.sy >= H - SHH - 3) && s.inv === 0) {
          s.lives--;
          addPtcl(SHIP_X, s.sy, 18, '#ff4400', 6, 4, 45);
          addPtcl(SHIP_X, s.sy, 10, '#ffaa00', 4, 2.5, 35);
          if (s.lives <= 0) { s.gs = 'gameOver'; tone(100, 700, 'sawtooth', 0.06); }
          else { s.inv = INV_FRAMES; s.sy = H / 2; tone(200, 200, 'square', 0.06); }
        }

        // Scroll background
        s.bx1 += s.spd * 0.09;
        s.bx2 += s.spd * 0.24;
        s.bx3 += s.spd * 0.58;

        // Move gates
        for (const g of s.gates) g.x -= s.spd;
        s.gates = s.gates.filter(g => g.x > -GATE_HW - 20);

        // Gate pass + collision
        for (const g of s.gates) {
          if (!g.passed && g.x + GATE_HW < SHIP_X - SHW) {
            g.passed = true; s.score += SCORE_PER_GATE;
            tone(700, 55, 'sine', 0.055);
            addPtcl(SHIP_X + 24, s.sy, 7, '#00aaff', 4, 3, 32);
            if (s.score >= WIN_SCORE) {
              s.gs = 'won'; s.accessT = 0;
              tone(880, 320, 'sine', 0.08);
              setTimeout(() => tone(1100, 320, 'sine', 0.08), 330);
              setTimeout(() => tone(1320, 500, 'sine', 0.08), 670);
              wonRef.current?.();
            }
          }
          if (s.inv === 0) {
            const gapTop = g.mid - g.gap / 2;
            const gapBot = g.mid + g.gap / 2;
            const sl = SHIP_X - SHW + 6, sr = SHIP_X + SHW - 6;
            const st2 = s.sy - SHH + 2, sb = s.sy + SHH - 2;
            if (sr > g.x - GATE_HW && sl < g.x + GATE_HW) {
              if (st2 < gapTop || sb > gapBot) {
                s.lives--;
                addPtcl(SHIP_X, s.sy, 22, '#ff4400', 7, 4, 50);
                addPtcl(SHIP_X, s.sy, 14, '#ffaa00', 5, 3, 38);
                addPtcl(SHIP_X, s.sy, 8,  '#ffff00', 4, 2, 28);
                if (s.lives <= 0) { s.gs = 'gameOver'; tone(100, 700, 'sawtooth', 0.06); }
                else { s.inv = INV_FRAMES; tone(200, 200, 'square', 0.06); }
                break;
              }
            }
          }
        }

        // Spawn gates (with grace period at start)
        if (s.graceT > 0) {
          s.graceT--;
        } else {
          s.spawnT++;
          const interval = Math.max(130, 225 - Math.floor(s.score / 10) * 9);
          if (s.spawnT >= interval || s.gates.length === 0) {
            s.spawnT = 0;
            const curGap = Math.max(GAP_MIN, GAP_START - (s.score / WIN_SCORE) * (GAP_START - GAP_MIN));
            const margin = 60 + curGap / 2;
            const mid = margin + Math.random() * (H - 2 * margin);
            s.gates.push({ x: W + GATE_HW + 20, mid, gap: curGap, passed: false, seed: ++seedRef.current * 1337 });
            tone(160, 40, 'sine', 0.03);
          }
        }

        // Speed scaling
        s.spd = Math.min(SPD_MAX, SPD_START + s.score * 0.065);

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

        // Invincibility
        if (s.inv > 0) s.inv--;

        // Floating debris chunks
        s.chunkT++;
        if (s.chunkT >= 55) {
          s.chunkT = 0;
          const sz = 5 + Math.random() * 16;
          s.chunks.push({
            x: W + sz + 10, y: 15 + Math.random() * (H - 30),
            r: sz, rot: Math.random() * Math.PI * 2,
            rv: (Math.random() - 0.5) * 0.035,
            spd: s.spd * (0.25 + Math.random() * 0.35),
            sides: 5 + Math.floor(Math.random() * 4),
          });
        }
        for (const c of s.chunks) { c.x -= c.spd; c.rot += c.rv; }
        s.chunks = s.chunks.filter(c => c.x > -c.r - 10);

        // Particles
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
