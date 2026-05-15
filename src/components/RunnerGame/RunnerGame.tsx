'use client';
import React, { useEffect, useRef } from 'react';

const W = 800, H = 400;
const SHIP_X = 140;
const SHW = 22, SHH = 9;
const WIN_SCORE = 50;
const BASE_SPD = 3.2;
const HIT_W = 15, HIT_H = 6;       // tight hitbox (smaller than visual)
const OBS_W = 50;
const GAP_START = 130;              // half-gap px at start
const GAP_MIN = 78;
const SPAWN_START = 130;            // frames between obstacle spawns
const SPAWN_MIN = 72;
const PTS_PER_GATE = 5;

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
interface Trail { x: number; y: number; r: number; a: number }
interface Prtcl { x: number; y: number; vx: number; vy: number; life: number; max: number; clr: string; r: number }
interface Obs   { x: number; gapY: number; gapH: number; scored: boolean }
type GS = 'idle' | 'playing' | 'dead' | 'won';

interface GameState {
  gs: GS; score: number;
  shipY: number; targetY: number;
  farStars: Star[]; midStars: Star[]; nearStars: Star[];
  bx1: number; bx2: number; bx3: number;
  obstacles: Obs[];
  spawnTimer: number; spawnEvery: number; speed: number;
  ptcl: Prtcl[]; trail: Trail[];
  frame: number; accessT: number; flashTimer: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function mkStars(n: number, rMin: number, rMax: number): Star[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: rMin + Math.random() * (rMax - rMin),
    a: 0.3 + Math.random() * 0.7, phase: Math.random() * Math.PI * 2,
  }));
}
function wrapX(x: number, bx: number) { return (((x - bx % W) % W) + W) % W; }

// ── Draw: background ──────────────────────────────────────────────────────────
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
    grd.addColorStop(0, b.c); grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.scale(1, b.ry / b.rx);
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(bxn, b.vy * (b.rx / b.ry), b.rx, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

function drawStars(ctx: CanvasRenderingContext2D, stars: Star[], bx: number, frame: number) {
  for (const s of stars) {
    const x = wrapX(s.x, bx);
    ctx.globalAlpha = s.a * (0.65 + 0.35 * Math.sin(frame * 0.04 + s.phase));
    ctx.fillStyle = '#c8d8ff';
    ctx.beginPath(); ctx.arc(x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ── Draw: obstacle pillars ────────────────────────────────────────────────────
function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obs) {
  const topH = obs.gapY - obs.gapH;
  const botY = obs.gapY + obs.gapH;
  const botH = H - botY;

  const grad = ctx.createLinearGradient(obs.x, 0, obs.x + OBS_W, 0);
  grad.addColorStop(0, '#04111f');
  grad.addColorStop(0.45, '#071d38');
  grad.addColorStop(1, '#020a14');
  ctx.fillStyle = grad;
  if (topH > 0) ctx.fillRect(obs.x, 0, OBS_W, topH);
  if (botH > 0) ctx.fillRect(obs.x, botY, OBS_W, botH);

  // Cyan edge lines
  ctx.fillStyle = 'rgba(0,229,255,0.85)';
  ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 8;
  if (topH > 0) {
    ctx.fillRect(obs.x, 0, 2, topH);
    ctx.fillRect(obs.x + OBS_W - 2, 0, 2, topH);
  }
  if (botH > 0) {
    ctx.fillRect(obs.x, botY, 2, botH);
    ctx.fillRect(obs.x + OBS_W - 2, botY, 2, botH);
  }

  // Gap mouth glow bar
  ctx.shadowBlur = 20; ctx.fillStyle = '#00e5ff';
  if (topH > 0) ctx.fillRect(obs.x - 5, topH - 3, OBS_W + 10, 3);
  if (botH > 0) ctx.fillRect(obs.x - 5, botY,     OBS_W + 10, 3);
  ctx.shadowBlur = 0;
}

// ── Draw: ship ────────────────────────────────────────────────────────────────
function drawShip(ctx: CanvasRenderingContext2D, sy: number, frame: number) {
  const x = SHIP_X, y = sy;
  ctx.save();

  const exhaustLen = 26 + Math.sin(frame * 0.35) * 8;
  const jitter = Math.sin(frame * 0.5) * 2;
  const eg1 = ctx.createLinearGradient(x - SHW, y, x - SHW - exhaustLen, y);
  eg1.addColorStop(0, 'rgba(20,100,220,0.6)');
  eg1.addColorStop(0.45, 'rgba(0,50,150,0.2)');
  eg1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = eg1;
  ctx.beginPath();
  ctx.moveTo(x - SHW, y - 6); ctx.lineTo(x - SHW - exhaustLen, y + jitter); ctx.lineTo(x - SHW, y + 6);
  ctx.closePath(); ctx.fill();

  const wg = ctx.createLinearGradient(x - 4, y, x - SHW - 6, y + SHH + 20);
  wg.addColorStop(0, '#1a3560'); wg.addColorStop(1, '#0b1a30');
  ctx.fillStyle = wg; ctx.shadowColor = '#0055aa'; ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(x - 2, y - 5); ctx.lineTo(x - 8, y - SHH - 1);
  ctx.lineTo(x - SHW - 4, y - SHH - 19); ctx.lineTo(x - SHW, y - SHH - 14);
  ctx.lineTo(x - 10, y - SHH + 3); ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 2, y + 5); ctx.lineTo(x - 8, y + SHH + 1);
  ctx.lineTo(x - SHW - 4, y + SHH + 19); ctx.lineTo(x - SHW, y + SHH + 14);
  ctx.lineTo(x - 10, y + SHH - 3); ctx.closePath(); ctx.fill();

  const bg = ctx.createLinearGradient(x - SHW, y - SHH, x + SHW, y + SHH);
  bg.addColorStop(0, '#1e4070'); bg.addColorStop(0.45, '#2a60a8'); bg.addColorStop(1, '#0d1e38');
  ctx.fillStyle = bg; ctx.shadowColor = '#0066cc'; ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(x + SHW, y);
  ctx.lineTo(x + SHW - 10, y - SHH + 2); ctx.lineTo(x - SHW + 14, y - SHH);
  ctx.lineTo(x - SHW, y - 5); ctx.lineTo(x - SHW, y + 5);
  ctx.lineTo(x - SHW + 14, y + SHH); ctx.lineTo(x + SHW - 10, y + SHH - 2);
  ctx.closePath(); ctx.fill();

  const cg = ctx.createRadialGradient(x + 6, y - 2, 0, x + 6, y, 9);
  cg.addColorStop(0, 'rgba(170,235,255,0.95)');
  cg.addColorStop(0.55, 'rgba(0,170,255,0.75)');
  cg.addColorStop(1, 'rgba(0,70,140,0.3)');
  ctx.fillStyle = cg; ctx.shadowColor = '#00ddff'; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.ellipse(x + 6, y, 11, SHH - 1, 0.12, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ── Draw: particles ───────────────────────────────────────────────────────────
function drawPrtcl(ctx: CanvasRenderingContext2D, p: Prtcl) {
  const a = p.life / p.max;
  ctx.save(); ctx.globalAlpha = a;
  ctx.shadowColor = p.clr; ctx.shadowBlur = 6;
  ctx.fillStyle = p.clr;
  ctx.beginPath(); ctx.arc(p.x, p.y, p.r * Math.max(a, 0.1), 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ── Draw: HUD ─────────────────────────────────────────────────────────────────
function drawHUD(ctx: CanvasRenderingContext2D, score: number, scale: number) {
  const sf = (n: number, min = 7) => Math.round(Math.max(min / scale, n));
  ctx.save();

  ctx.font = `bold ${sf(12, 9)}px monospace`;
  ctx.shadowColor = '#00aaff'; ctx.shadowBlur = 8;
  ctx.fillStyle = '#00aaff'; ctx.textAlign = 'left';
  ctx.fillText(`PTS: ${Math.floor(score)}`, 12, 24);

  const bW = 180, bH = 7, bX = (W - bW) / 2, bY = 13;
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
  ctx.font = `${sf(9, 7)}px monospace`; ctx.fillStyle = '#0066aa99';
  ctx.textAlign = 'left';
  ctx.fillText(`/${WIN_SCORE}`, bX + bW + 4, bY + 7);

  ctx.restore();
}

// ── Draw: overlays ────────────────────────────────────────────────────────────
function drawOverlay(ctx: CanvasRenderingContext2D, gs: GS, score: number, accessT: number, flashTimer: number, scale: number) {
  const sf = (n: number, min = 8) => Math.round(Math.max(min / scale, n));
  const cx = W / 2;

  if (gs === 'idle') {
    ctx.save();
    ctx.fillStyle = 'rgba(0,4,18,0.82)'; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 4) { ctx.globalAlpha = 0.03; ctx.fillStyle = '#0055ff'; ctx.fillRect(0, y, W, 1); }
    ctx.globalAlpha = 1; ctx.textAlign = 'center';

    ctx.font = `bold ${sf(28, 13)}px monospace`;
    ctx.shadowColor = '#0077ff'; ctx.shadowBlur = 28;
    ctx.fillStyle = '#00aaff';
    ctx.fillText('ASTEROID GAUNTLET', cx, H / 2 - 54);

    ctx.font = `${sf(10, 7)}px monospace`;
    ctx.shadowBlur = 0; ctx.fillStyle = '#005588';
    ctx.fillText('PILOT THROUGH THE GATES · SCORE 50pts TO UNLOCK', cx, H / 2 - 24);

    ctx.font = `bold ${sf(12, 8)}px monospace`;
    ctx.shadowColor = '#6600ff'; ctx.shadowBlur = 14;
    ctx.fillStyle = '#aa44ff';
    ctx.fillText('[ CLICK / TAP TO LAUNCH ]', cx, H / 2 + 14);

    ctx.font = `${sf(9, 7)}px monospace`;
    ctx.shadowBlur = 0; ctx.fillStyle = '#003355bb';
    ctx.fillText('MOVE MOUSE  ·  DRAG FINGER  ·  FLY THROUGH GAPS', cx, H / 2 + 44);
    ctx.restore();

  } else if (gs === 'dead') {
    if (flashTimer > 0) {
      ctx.save();
      ctx.globalAlpha = (flashTimer / 14) * 0.5;
      ctx.fillStyle = '#ff2200'; ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    ctx.save();
    ctx.fillStyle = 'rgba(0,4,18,0.80)'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';

    ctx.font = `bold ${sf(32, 14)}px monospace`;
    ctx.shadowColor = '#ff2200'; ctx.shadowBlur = 32;
    ctx.fillStyle = '#ff4422';
    ctx.fillText('HULL BREACH', cx, H / 2 - 38);

    ctx.font = `${sf(11, 8)}px monospace`;
    ctx.shadowBlur = 0; ctx.fillStyle = '#886655';
    ctx.fillText(`SCORE: ${Math.floor(score)} / ${WIN_SCORE} pts`, cx, H / 2 + 2);

    ctx.font = `bold ${sf(12, 8)}px monospace`;
    ctx.shadowColor = '#6600ff'; ctx.shadowBlur = 14;
    ctx.fillStyle = '#aa44ff';
    ctx.fillText('[ CLICK / TAP TO RETRY ]', cx, H / 2 + 38);
    ctx.restore();

  } else if (gs === 'won') {
    const a = Math.min(accessT / 45, 1);
    ctx.save();
    for (let y = 0; y < H; y += 3) { ctx.globalAlpha = a * 0.04; ctx.fillStyle = '#0044ff'; ctx.fillRect(0, y, W, 1); }
    ctx.globalAlpha = a; ctx.textAlign = 'center';

    ctx.font = `bold ${sf(36, 16)}px monospace`;
    ctx.shadowColor = '#0088ff'; ctx.shadowBlur = 44;
    ctx.fillStyle = '#00ccff';
    ctx.fillText('WARP ACHIEVED', cx, H / 2 - 52);

    ctx.font = `${sf(14, 10)}px monospace`;
    ctx.shadowColor = '#8800ff'; ctx.shadowBlur = 12;
    ctx.fillStyle = '#aa44ff';
    ctx.fillText(`SCORE: ${score}pts`, cx, H / 2 - 4);

    ctx.font = `${sf(12, 9)}px monospace`;
    ctx.shadowBlur = 5; ctx.fillStyle = '#ffffff';
    ctx.fillText('PORTFOLIO UNLOCKING...', cx, H / 2 + 38);
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

// ── Main draw ─────────────────────────────────────────────────────────────────
function draw(ctx: CanvasRenderingContext2D, s: GameState) {
  const scale = Math.min(1, Math.max(0.1, (ctx.canvas.clientWidth || W) / W));
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#000308'); sky.addColorStop(1, '#010614');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  drawNebula(ctx, s.bx1);
  drawStars(ctx, s.farStars, s.bx1, s.frame);
  drawStars(ctx, s.midStars, s.bx2, s.frame);
  drawStars(ctx, s.nearStars, s.bx3, s.frame);

  for (const obs of s.obstacles) drawObstacle(ctx, obs);
  for (const t of s.trail) {
    ctx.save(); ctx.globalAlpha = t.a;
    ctx.shadowColor = '#0077ff'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#0055cc';
    ctx.beginPath(); ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  for (const p of s.ptcl) drawPrtcl(ctx, p);

  drawShip(ctx, s.shipY, s.frame);

  if (s.gs === 'playing') drawHUD(ctx, s.score, scale);
  if (s.gs !== 'playing') drawOverlay(ctx, s.gs, Math.floor(s.score), s.accessT, s.flashTimer, scale);
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

    // Convert clientY to canvas logical Y
    function getCanvasY(clientY: number): number {
      const rect = canvas!.getBoundingClientRect();
      const raw = ((clientY - rect.top) / rect.height) * H;
      return Math.min(Math.max(raw, HIT_H + 5), H - HIT_H - 5);
    }

    function makeState(prevTargetY = H / 2): GameState {
      return {
        gs: 'idle', score: 0,
        shipY: prevTargetY, targetY: prevTargetY,
        farStars: baseF, midStars: baseM, nearStars: baseN,
        bx1: 0, bx2: 0, bx3: 0,
        obstacles: [],
        spawnTimer: SPAWN_START, spawnEvery: SPAWN_START, speed: BASE_SPD,
        ptcl: [], trail: [],
        frame: 0, accessT: 0, flashTimer: 0,
      };
    }

    stateRef.current = makeState();

    function addPtcl(x: number, y: number, n: number, clr: string, spd: number, r: number, life: number) {
      const s = stateRef.current!;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = spd * (0.3 + Math.random() * 0.7);
        s.ptcl.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life, max: life, clr, r });
      }
    }

    function spawnObs(s: GameState) {
      const margin = 70;
      const gapY = margin + Math.random() * (H - margin * 2);
      const t = Math.min(s.score / WIN_SCORE, 1);
      const gapH = GAP_START - t * (GAP_START - GAP_MIN);
      s.obstacles.push({ x: W + 10, gapY, gapH, scored: false });
    }

    function doStart() {
      const prev = stateRef.current!.targetY;
      const st = makeState(prev);
      st.gs = 'playing';
      stateRef.current = st;
      tone(500, 100, 'sine', 0.06);
    }

    function doDead() {
      const s = stateRef.current!;
      s.gs = 'dead'; s.flashTimer = 14;
      addPtcl(SHIP_X, s.shipY, 20, '#ff4400', 5, 3, 32);
      addPtcl(SHIP_X, s.shipY, 10, '#ffaa00', 3, 2, 22);
      tone(140, 420, 'sawtooth', 0.09);
    }

    function handleMouseMove(e: MouseEvent) {
      if (stateRef.current) stateRef.current.targetY = getCanvasY(e.clientY);
    }

    function handleTouchMove(e: TouchEvent) {
      e.preventDefault();
      if (stateRef.current && e.touches[0])
        stateRef.current.targetY = getCanvasY(e.touches[0].clientY);
    }

    function handleClick() {
      const gs = stateRef.current?.gs;
      if (gs === 'idle' || gs === 'dead') doStart();
    }

    function handleKey(e: KeyboardEvent) {
      if (e.code === 'Space') { e.preventDefault(); handleClick(); }
    }

    function handleTouchStart(e: TouchEvent) {
      e.preventDefault();
      if (e.touches[0] && stateRef.current)
        stateRef.current.targetY = getCanvasY(e.touches[0].clientY);
      handleClick();
    }

    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    const loop = () => {
      const s = stateRef.current!;
      s.frame++;

      if (s.flashTimer > 0) s.flashTimer--;

      // Background always scrolls (slower in idle/dead)
      const bgSpd = s.gs === 'playing' ? s.speed : BASE_SPD * 0.3;
      s.bx1 += bgSpd * 0.09;
      s.bx2 += bgSpd * 0.24;
      s.bx3 += bgSpd * 0.58;

      // Ship always follows pointer (shows responsiveness in idle too)
      const lerp = s.gs === 'playing' ? 0.14 : 0.07;
      s.shipY += (s.targetY - s.shipY) * lerp;
      s.shipY = Math.min(Math.max(s.shipY, HIT_H + 5), H - HIT_H - 5);

      // Engine trail always runs when not dead
      if (s.gs !== 'dead' && s.frame % 2 === 0) {
        s.trail.push({
          x: SHIP_X - SHW - 2 + (Math.random() - 0.5) * 5,
          y: s.shipY + (Math.random() - 0.5) * 7,
          r: 3.5 + Math.random() * 2, a: 0.55,
        });
      }
      s.trail = s.trail.filter(t => { t.a -= 0.045; t.r *= 0.91; return t.a > 0.01; });

      if (s.gs === 'playing') {
        // Move obstacles
        for (const obs of s.obstacles) obs.x -= s.speed;

        // Score + collision
        let died = false;
        for (const obs of s.obstacles) {
          if (!obs.scored && obs.x + OBS_W < SHIP_X - HIT_W) {
            obs.scored = true;
            s.score += PTS_PER_GATE;
            tone(660, 70, 'sine', 0.04);
            addPtcl(SHIP_X + HIT_W + 8, s.shipY, 5, '#00e5ff', 2.5, 1.5, 18);
          }
          if (!died) {
            const inX = obs.x < SHIP_X + HIT_W && obs.x + OBS_W > SHIP_X - HIT_W;
            if (inX && (s.shipY - HIT_H < obs.gapY - obs.gapH || s.shipY + HIT_H > obs.gapY + obs.gapH)) {
              doDead(); died = true;
            }
          }
        }

        if (!died) {
          // Remove off-screen
          s.obstacles = s.obstacles.filter(o => o.x + OBS_W > -10);

          // Spawn
          s.spawnTimer--;
          if (s.spawnTimer <= 0) {
            spawnObs(s);
            const t = Math.min(s.score / WIN_SCORE, 1);
            s.spawnEvery = Math.round(SPAWN_START - t * (SPAWN_START - SPAWN_MIN));
            s.spawnTimer = s.spawnEvery;
            s.speed = BASE_SPD + t * 1.8;
          }

          // Win
          if (s.score >= WIN_SCORE) {
            s.score = WIN_SCORE; s.gs = 'won'; s.accessT = 0;
            tone(880, 320, 'sine', 0.08);
            setTimeout(() => tone(1100, 320, 'sine', 0.08), 330);
            setTimeout(() => tone(1320, 500, 'sine', 0.08), 670);
            wonRef.current?.();
          }
        }
      }

      // Particles always step
      s.ptcl = s.ptcl.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.06; return --p.life > 0; });

      if (s.gs === 'won') s.accessT++;

      draw(ctx, s);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: `${W}px`, aspectRatio: `${W}/${H}`, cursor: 'crosshair' }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: '100%', height: '100%', display: 'block',
          borderRadius: '10px',
          border: '1px solid rgba(0,120,255,0.28)',
          boxShadow: '0 0 30px rgba(0,80,255,0.2), 0 0 60px rgba(80,0,200,0.1)',
          touchAction: 'none',
        }}
      />
    </div>
  );
};
