'use client';

import React, { useEffect, useRef } from 'react';

// ── Constants ────────────────────────────────────────────────────────────────
const W = 800, H = 380;
const PLAYER_X = 110, GROUND_Y = 310;
const PH = 44, PW = 28;
const GRAVITY = 0.72, JUMP_POWER = -16.5, MAX_FALL = 15;
const WIN_SCORE = 100, POINTS_PER_OBS = 10;
const LIVES_START = 3;
const INVINCIBLE_FRAMES = 90;

const FAR_H  = [32, 45, 28, 52, 38, 41, 35, 48, 30, 44, 37, 50, 27, 43, 34, 40];
const MID_H  = [70, 90, 65, 80,100, 75, 85, 68, 95, 72, 88, 62, 78, 92, 82, 77];
const NEAR_H = [100,130,110, 90,145,115,125, 95,135,105,120,140, 98,128,112,118];

// ── Types ────────────────────────────────────────────────────────────────────
type ObsType = 0 | 1 | 2;
interface Obs { x: number; w: number; h: number; type: ObsType; passed: boolean }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; r: number }
type GS = 'idle' | 'playing' | 'gameOver' | 'won';
interface GameState {
  gs: GS; score: number;
  pY: number; pVY: number;
  obstacles: Obs[]; particles: Particle[];
  spawnTimer: number; speed: number; frame: number;
  bgX1: number; bgX2: number; bgX3: number;
  lives: number; invincible: number; accessTimer: number;
}

// ── Sound ────────────────────────────────────────────────────────────────────
function playSound(freq: number, dur: number, type: OscillatorType = 'square') {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur / 1000);
  } catch (_e) { /* audio unavailable */ }
}

// ── Draw: city layer ─────────────────────────────────────────────────────────
function drawCityLayer(
  ctx: CanvasRenderingContext2D, bgX: number,
  bW: number, gap: number, heights: number[],
  fill: string, win: string,
) {
  const stride = bW + gap;
  const firstIdx = Math.floor(bgX / stride);
  const offsetX = bgX % stride;
  const count = Math.ceil(W / stride) + 3;
  for (let i = 0; i < count; i++) {
    const idx = (firstIdx + i) % heights.length;
    const bx = i * stride - offsetX;
    const bh = heights[idx];
    const by = GROUND_Y - bh;
    ctx.fillStyle = fill;
    ctx.fillRect(bx, by, bW, bh);
    ctx.fillStyle = win;
    const wW = 3, wH = 4, wGX = Math.max(6, Math.floor(bW / 4)), wGY = 9;
    for (let wy = by + 8; wy + wH < GROUND_Y - 2; wy += wGY) {
      for (let wx = bx + 3; wx + wW < bx + bW - 2; wx += wGX) {
        if (((idx * 7 + Math.floor((wy - by) / wGY) * 3) % 5) !== 0)
          ctx.fillRect(wx, wy, wW, wH);
      }
    }
  }
}

// ── Draw: ground ─────────────────────────────────────────────────────────────
function drawGround(ctx: CanvasRenderingContext2D, bgX: number) {
  ctx.save();
  ctx.shadowColor = '#00ff44'; ctx.shadowBlur = 10;
  ctx.strokeStyle = '#00ff44'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(W, GROUND_Y); ctx.stroke();
  ctx.shadowBlur = 0; ctx.lineWidth = 1;
  for (let y = GROUND_Y + 18; y < H; y += 18) {
    ctx.globalAlpha = (1 - (y - GROUND_Y) / (H - GROUND_Y)) * 0.3;
    ctx.strokeStyle = '#00ff44';
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const gs = 60, ox = bgX % gs;
  for (let x = -ox; x <= W; x += gs) {
    ctx.globalAlpha = 0.1; ctx.strokeStyle = '#00ff44';
    ctx.beginPath(); ctx.moveTo(x, GROUND_Y); ctx.lineTo(x, H); ctx.stroke();
  }
  ctx.globalAlpha = 1; ctx.restore();
}

// ── Draw: player ─────────────────────────────────────────────────────────────
function drawPlayer(ctx: CanvasRenderingContext2D, pY: number, frame: number, invincible: number) {
  if (invincible > 0 && Math.floor(invincible / 5) % 2 === 0) return;
  const px = PLAYER_X;
  const onGround = pY >= GROUND_Y - PH - 2;
  const lp = (frame % 18) / 18;
  ctx.save();

  // body
  ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 18;
  const bg = ctx.createLinearGradient(px, pY + 10, px + PW, pY + PH - 10);
  bg.addColorStop(0, '#cc00cc'); bg.addColorStop(1, '#0088cc');
  ctx.fillStyle = bg;
  ctx.fillRect(px, pY + 12, PW, PH - 22);

  // head
  ctx.shadowBlur = 10; ctx.fillStyle = '#aa00aa';
  ctx.fillRect(px + 3, pY, PW - 6, 13);

  // visor
  ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 12; ctx.fillStyle = '#00ffff';
  ctx.fillRect(px + 5, pY + 3, PW - 10, 6);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(px + 6, pY + 4, 4, 2);

  // legs
  ctx.shadowColor = '#aa00ff'; ctx.shadowBlur = 6; ctx.fillStyle = '#880088';
  if (!onGround) {
    ctx.fillRect(px + 2, pY + PH - 10, 11, 8);
    ctx.fillRect(px + PW - 13, pY + PH - 10, 11, 8);
  } else {
    const l1 = Math.sin(lp * Math.PI * 2);
    const l2 = Math.sin((lp + 0.5) * Math.PI * 2);
    const h1 = Math.max(4, 12 + l1 * 4);
    const h2 = Math.max(4, 12 + l2 * 4);
    ctx.fillRect(px + 2, pY + PH - h1, 11, h1);
    ctx.fillRect(px + PW - 13, pY + PH - h2, 11, h2);
    if (l1 > 0.5) {
      ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 8;
      ctx.fillStyle = '#ff44ff';
      ctx.fillRect(px + 2, pY + PH - 3, 11, 3);
    }
    if (l2 > 0.5) {
      ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 8;
      ctx.fillStyle = '#ff44ff';
      ctx.fillRect(px + PW - 13, pY + PH - 3, 11, 3);
    }
  }
  ctx.restore();
}

// ── Draw: obstacle ───────────────────────────────────────────────────────────
function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obs, frame: number) {
  ctx.save();
  if (obs.type === 0) {
    ctx.shadowColor = '#ff0040'; ctx.shadowBlur = 16;
    const g = ctx.createLinearGradient(obs.x, GROUND_Y - obs.h, obs.x, GROUND_Y);
    g.addColorStop(0, '#ff0080'); g.addColorStop(0.4, '#ff2050'); g.addColorStop(1, '#440010');
    ctx.fillStyle = g;
    ctx.fillRect(obs.x, GROUND_Y - obs.h, obs.w, obs.h);
    const la = 0.4 + Math.sin(frame * 0.25) * 0.3;
    ctx.globalAlpha = la; ctx.strokeStyle = '#ffaaaa'; ctx.lineWidth = 1;
    const lo = (frame * 2) % 8;
    for (let y = GROUND_Y - obs.h + lo; y < GROUND_Y; y += 8) {
      ctx.beginPath(); ctx.moveTo(obs.x + 1, y); ctx.lineTo(obs.x + obs.w - 1, y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } else if (obs.type === 1) {
    ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 14;
    const g = ctx.createLinearGradient(obs.x, GROUND_Y - obs.h, obs.x, GROUND_Y);
    g.addColorStop(0, '#ffaa00'); g.addColorStop(1, '#cc4400');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(obs.x + obs.w / 2, GROUND_Y - obs.h);
    ctx.lineTo(obs.x, GROUND_Y);
    ctx.lineTo(obs.x + obs.w, GROUND_Y);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ffcc44'; ctx.lineWidth = 1.5; ctx.stroke();
  } else {
    ctx.shadowColor = '#8800ff'; ctx.shadowBlur = 12;
    const bH = Math.floor((obs.h - 4) / 2);
    const cols = ['#6600cc', '#4400aa'];
    const strks = ['#aa44ff', '#8833dd'];
    for (let b = 0; b < 2; b++) {
      const by = GROUND_Y - obs.h + b * (bH + 4);
      ctx.fillStyle = cols[b]; ctx.fillRect(obs.x, by, obs.w, bH);
      ctx.strokeStyle = strks[b]; ctx.lineWidth = 1;
      ctx.strokeRect(obs.x + 0.5, by + 0.5, obs.w - 1, bH - 1);
      ctx.strokeStyle = '#aa44ff33';
      for (let x2 = obs.x + 6; x2 < obs.x + obs.w; x2 += 6) {
        ctx.beginPath(); ctx.moveTo(x2, by); ctx.lineTo(x2, by + bH); ctx.stroke();
      }
    }
  }
  ctx.restore();
}

// ── Draw: particle ───────────────────────────────────────────────────────────
function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  const a = p.life / p.maxLife;
  ctx.save(); ctx.globalAlpha = a;
  ctx.shadowColor = p.color; ctx.shadowBlur = 6; ctx.fillStyle = p.color;
  ctx.beginPath(); ctx.arc(p.x, p.y, p.r * a, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ── Draw: HUD ────────────────────────────────────────────────────────────────
function drawHUD(ctx: CanvasRenderingContext2D, score: number, lives: number, scale: number) {
  const sf = (px: number, min = 7) => Math.round(Math.max(min / scale, px));
  ctx.save();
  ctx.font = `bold ${sf(13, 9)}px monospace`;
  ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 8;
  ctx.fillStyle = '#00ffff'; ctx.textAlign = 'left';
  ctx.fillText(`SCORE: ${score}`, 12, 24);

  const bW = 200, bH = 8, bX = (W - bW) / 2, bY = 12;
  const prog = Math.min(score / WIN_SCORE, 1);
  ctx.shadowBlur = 0; ctx.fillStyle = '#001122'; ctx.fillRect(bX, bY, bW, bH);
  if (prog > 0) {
    const pg = ctx.createLinearGradient(bX, 0, bX + bW, 0);
    pg.addColorStop(0, '#00ffff'); pg.addColorStop(1, '#ff00ff');
    ctx.fillStyle = pg; ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 6;
    ctx.fillRect(bX, bY, bW * prog, bH);
  }
  ctx.shadowBlur = 0; ctx.strokeStyle = '#00ffff44'; ctx.lineWidth = 1;
  ctx.strokeRect(bX, bY, bW, bH);
  ctx.font = `${sf(9, 7)}px monospace`; ctx.fillStyle = '#00ffff66';
  ctx.fillText(`/${WIN_SCORE}`, bX + bW + 5, bY + 8);

  ctx.textAlign = 'right';
  for (let i = 0; i < LIVES_START; i++) {
    ctx.fillStyle = i < lives ? '#ff00ff' : '#330033';
    ctx.shadowColor = i < lives ? '#ff00ff' : 'transparent';
    ctx.shadowBlur = i < lives ? 8 : 0;
    ctx.font = `${sf(14, 10)}px monospace`;
    ctx.fillText('♦', W - 12 - i * 20, 24);
  }
  ctx.restore();
}

// ── Draw: overlay ────────────────────────────────────────────────────────────
function drawOverlay(ctx: CanvasRenderingContext2D, gs: GS, score: number, accessTimer: number, scale: number) {
  const sf = (px: number, min = 8) => Math.round(Math.max(min / scale, px));
  ctx.save();
  ctx.fillStyle = 'rgba(5,8,20,0.82)'; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  const cx = W / 2;

  if (gs === 'idle') {
    for (let y = 0; y < H; y += 4) {
      ctx.globalAlpha = 0.04; ctx.fillStyle = '#00ffff';
      ctx.fillRect(0, y, W, 1);
    }
    ctx.globalAlpha = 1;
    ctx.font = `bold ${sf(30, 16)}px monospace`;
    ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 24;
    ctx.fillStyle = '#00ffff'; ctx.fillText('INTERSTELLAR RUNNER', cx, H / 2 - 50);
    ctx.font = `bold ${sf(13, 9)}px monospace`;
    ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 12;
    ctx.fillStyle = '#ff00ff'; ctx.fillText('[ PRESS SPACE  /  CLICK  /  TAP ]', cx, H / 2);
    ctx.font = `${sf(11, 8)}px monospace`;
    ctx.shadowBlur = 0; ctx.fillStyle = '#aaaaaa';
    ctx.fillText(`Reach score ${WIN_SCORE} to unlock the portfolio`, cx, H / 2 + 32);
    ctx.font = `${sf(10, 7)}px monospace`; ctx.fillStyle = '#00ffff55';
    ctx.fillText(`♦ ${LIVES_START} lives  •  3 obstacle types  •  speed scales with score`, cx, H / 2 + 52);

  } else if (gs === 'gameOver') {
    ctx.font = `bold ${sf(34, 16)}px monospace`;
    ctx.shadowColor = '#ff0040'; ctx.shadowBlur = 28;
    ctx.fillStyle = '#ff0040'; ctx.fillText('ACCESS DENIED', cx, H / 2 - 45);
    ctx.font = `${sf(16, 11)}px monospace`;
    ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#00ffff'; ctx.fillText(`SCORE: ${score} / ${WIN_SCORE}`, cx, H / 2 - 5);
    ctx.font = `${sf(13, 9)}px monospace`;
    ctx.shadowColor = '#ff00ff'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#ff00ff'; ctx.fillText('[ RETRY: SPACE / CLICK / TAP ]', cx, H / 2 + 36);

  } else if (gs === 'won') {
    const a = Math.min(accessTimer / 45, 1);
    ctx.globalAlpha = a;
    for (let y = 0; y < H; y += 3) {
      ctx.globalAlpha = a * 0.05; ctx.fillStyle = '#00ff88';
      ctx.fillRect(0, y, W, 1);
    }
    ctx.globalAlpha = a;
    ctx.font = `bold ${sf(38, 16)}px monospace`;
    ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 36;
    ctx.fillStyle = '#00ff88'; ctx.fillText('ACCESS GRANTED', cx, H / 2 - 50);
    ctx.font = `${sf(16, 11)}px monospace`;
    ctx.shadowColor = '#00ffff'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#00ffff'; ctx.fillText(`FINAL SCORE: ${score}`, cx, H / 2);
    ctx.font = `${sf(12, 9)}px monospace`;
    ctx.shadowBlur = 5; ctx.fillStyle = '#ffffff';
    ctx.fillText('PORTFOLIO UNLOCKING...', cx, H / 2 + 38);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// ── Main draw ────────────────────────────────────────────────────────────────
function draw(ctx: CanvasRenderingContext2D, s: GameState) {
  const scale = Math.min(1, Math.max(0.1, (ctx.canvas.clientWidth || W) / W));
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, '#050814'); sky.addColorStop(1, '#0c0820');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

  drawCityLayer(ctx, s.bgX3, 24, 8,  FAR_H,  '#080d1e', '#0a1825');
  drawCityLayer(ctx, s.bgX2, 34, 10, MID_H,  '#0e0a28', '#16103a');
  drawCityLayer(ctx, s.bgX1, 44, 14, NEAR_H, '#160c38', '#1e0a50');
  drawGround(ctx, s.bgX1);

  for (const p of s.particles) drawParticle(ctx, p);
  for (const o of s.obstacles) drawObstacle(ctx, o, s.frame);
  if (s.gs !== 'idle') drawPlayer(ctx, s.pY, s.frame, s.invincible);
  if (s.gs === 'playing') drawHUD(ctx, s.score, s.lives, scale);
  if (s.gs !== 'playing') drawOverlay(ctx, s.gs, s.score, s.accessTimer, scale);
}

// ── Component ────────────────────────────────────────────────────────────────
interface RunnerGameProps { onGameWon?: () => void }

export const RunnerGame: React.FC<RunnerGameProps> = ({ onGameWon }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const animRef  = useRef<number>(0);
  const onWonRef = useRef(onGameWon);
  useEffect(() => { onWonRef.current = onGameWon; }, [onGameWon]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const makeState = (): GameState => ({
      gs: 'idle', score: 0,
      pY: GROUND_Y - PH, pVY: 0,
      obstacles: [], particles: [],
      spawnTimer: 0, speed: 6, frame: 0,
      bgX1: 0, bgX2: 0, bgX3: 0,
      lives: LIVES_START, invincible: 0, accessTimer: 0,
    });

    stateRef.current = makeState();

    const addParticles = (x: number, y: number, count: number, color: string, speed: number, r: number, life: number) => {
      const s = stateRef.current!;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * speed;
        s.particles.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - speed * 0.3, life, maxLife: life, color, r });
      }
    };

    const doJump = () => {
      const s = stateRef.current!;
      if (s.gs === 'playing' && s.pY >= GROUND_Y - PH - 3) {
        s.pVY = JUMP_POWER;
        playSound(620, 80, 'square');
        addParticles(PLAYER_X + PW / 2, GROUND_Y, 6, '#ff00ff', 2, 2, 18);
      }
    };

    const doStart = () => {
      stateRef.current = { ...makeState(), gs: 'playing' };
      playSound(440, 80, 'square');
    };

    const handleInput = () => {
      const gs = stateRef.current!.gs;
      if (gs === 'idle' || gs === 'gameOver') doStart();
      else if (gs === 'playing') doJump();
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); handleInput(); }
    };
    const handleClick = () => {
      if (stateRef.current!.gs !== 'won') handleInput();
    };
    const handleTouch = (e: TouchEvent) => { e.preventDefault(); handleInput(); };

    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });

    const loop = () => {
      const s = stateRef.current!;
      s.frame++;

      if (s.gs === 'playing') {
        // Physics
        s.pVY = Math.min(s.pVY + GRAVITY, MAX_FALL);
        s.pY  = Math.min(s.pY + s.pVY, GROUND_Y - PH);

        // Parallax scroll
        s.bgX1 += s.speed * 0.5;
        s.bgX2 += s.speed * 0.22;
        s.bgX3 += s.speed * 0.08;

        // Move + prune obstacles
        const nextObs: Obs[] = [];
        for (const o of s.obstacles) { o.x -= s.speed; if (o.x > -60) nextObs.push(o); }
        s.obstacles = nextObs;

        // Score
        for (const o of s.obstacles) {
          if (!o.passed && o.x + o.w < PLAYER_X) {
            o.passed = true;
            s.score += POINTS_PER_OBS;
            playSound(800, 40, 'sine');
            addParticles(PLAYER_X, s.pY + PH / 2, 5, '#00ffff', 3, 3, 30);
            if (s.score >= WIN_SCORE) {
              s.gs = 'won'; s.accessTimer = 0;
              playSound(880, 250, 'sine');
              setTimeout(() => playSound(1100, 250, 'sine'), 260);
              onWonRef.current?.();
            }
          }
        }

        // Spawn
        s.spawnTimer++;
        const interval = Math.max(52, 115 - Math.floor(s.score / 10) * 6);
        if (s.spawnTimer >= interval) {
          s.spawnTimer = 0;
          const r = Math.random();
          const type: ObsType = r < 0.4 ? 0 : r < 0.7 ? 1 : 2;
          const sizes: [number, number][] = [[16, 52], [30, 36], [24, 58]];
          const [w, h] = sizes[type];
          s.obstacles.push({ x: W + 10, w, h, type, passed: false });
          playSound(180, 50);
        }

        // Speed scaling
        s.speed = Math.min(6 + s.score * 0.07, 14);

        // Collision (reduced hitbox for fairness)
        if (s.invincible > 0) {
          s.invincible--;
        } else {
          outer: for (const o of s.obstacles) {
            const px = PLAYER_X + 7, py = s.pY + 7, pw = PW - 14, ph = PH - 9;
            if (px < o.x + o.w && px + pw > o.x && py < GROUND_Y && py + ph > GROUND_Y - o.h) {
              s.lives--;
              addParticles(PLAYER_X + PW / 2, s.pY + PH / 2, 15, '#ff0040', 6, 4, 45);
              if (s.lives <= 0) { s.gs = 'gameOver'; playSound(120, 500); }
              else              { s.invincible = INVINCIBLE_FRAMES; playSound(200, 180); }
              break outer;
            }
          }
        }

        // Particles
        const nextP: Particle[] = [];
        for (const p of s.particles) {
          p.x += p.vx; p.y += p.vy; p.life--;
          if (p.life > 0) nextP.push(p);
        }
        s.particles = nextP;
      }

      if (s.gs === 'won') s.accessTimer++;

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
          border: '1px solid rgba(0,255,255,0.35)',
          boxShadow: '0 0 30px rgba(0,255,255,0.2), 0 0 60px rgba(255,0,255,0.1)',
        }}
      />
    </div>
  );
};
