/**
 * Game Logic Utilities
 */
import { GAME_CONFIG, COLORS } from './gameConstants';
import { Obstacle } from './gameStore';

export const updatePlayerPhysics = (
  currentY: number,
  velocity: number,
) => {
  let newVelocity = velocity;
  let newY = currentY;

  // Apply gravity
  newVelocity += GAME_CONFIG.GRAVITY;

  // Limit fall speed
  if (newVelocity > GAME_CONFIG.MAX_FALL_SPEED) {
    newVelocity = GAME_CONFIG.MAX_FALL_SPEED;
  }

  // Update position
  newY += newVelocity;

  // Ground collision
  if (newY >= GAME_CONFIG.GROUND_Y) {
    newY = GAME_CONFIG.GROUND_Y;
    newVelocity = 0;
  }

  return { newY, newVelocity };
};

export const handleJump = (currentY: number, currentVelocity: number) => {
  if (currentY >= GAME_CONFIG.GROUND_Y) {
    return GAME_CONFIG.JUMP_POWER;
  }
  return currentVelocity;
};

export const updateObstacles = (
  obstacles: Obstacle[],
  obstacleSpeed: number,
) => {
  return obstacles
    .map((obstacle) => ({
      ...obstacle,
      x: obstacle.x - obstacleSpeed,
    }))
    .filter((obstacle) => obstacle.x > -GAME_CONFIG.OBSTACLE_WIDTH);
};

export const checkCollision = (
  playerX: number,
  playerY: number,
  playerWidth: number,
  playerHeight: number,
  obstacles: Obstacle[],
): boolean => {
  return obstacles.some((obstacle) => {
    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacle.x + GAME_CONFIG.OBSTACLE_WIDTH;
    const obstacleTop = obstacle.y;
    const obstacleBottom = obstacle.y + GAME_CONFIG.OBSTACLE_HEIGHT;

    const playerLeft = playerX;
    const playerRight = playerX + playerWidth;
    const playerTop = playerY;
    const playerBottom = playerY + playerHeight;

    return !(
      playerRight < obstacleLeft ||
      playerLeft > obstacleRight ||
      playerBottom < obstacleTop ||
      playerTop > obstacleBottom
    );
  });
};

export const calculateObstacleSpeed = (difficulty: number): number => {
  const speed = GAME_CONFIG.OBSTACLE_SPEED_START + (difficulty - 1) * 0.5;
  return Math.min(speed, GAME_CONFIG.OBSTACLE_SPEED_MAX);
};

export const calculateSpawnInterval = (difficulty: number): number => {
  const interval =
    GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL_START - (difficulty - 1) * 2;
  return Math.max(interval, GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL_MIN);
};

export const calculateDifficulty = (score: number): number => {
  return 1 + Math.floor(score / GAME_CONFIG.DIFFICULTY_INCREASE_INTERVAL);
};

export const drawGame = (
  ctx: CanvasRenderingContext2D,
  playerY: number,
  obstacles: Obstacle[],
  score: number,
  difficulty: number,
) => {
  // Clear canvas with gradient background
  const gradient = ctx.createLinearGradient(
    0,
    0,
    GAME_CONFIG.CANVAS_WIDTH,
    GAME_CONFIG.CANVAS_HEIGHT,
  );
  gradient.addColorStop(0, COLORS.BACKGROUND);
  gradient.addColorStop(1, '#1a1f3a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

  // Draw grid background
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  for (let i = 0; i < GAME_CONFIG.CANVAS_WIDTH; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, GAME_CONFIG.CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let i = 0; i < GAME_CONFIG.CANVAS_HEIGHT; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(GAME_CONFIG.CANVAS_WIDTH, i);
    ctx.stroke();
  }

  // Draw ground
  ctx.fillStyle = COLORS.NEON_GREEN;
  ctx.fillRect(
    0,
    GAME_CONFIG.GROUND_Y,
    GAME_CONFIG.CANVAS_WIDTH,
    GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.GROUND_Y,
  );

  // Draw ground glow
  ctx.shadowColor = COLORS.NEON_GREEN;
  ctx.shadowBlur = 10;
  ctx.strokeStyle = COLORS.NEON_GREEN;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GAME_CONFIG.GROUND_Y);
  ctx.lineTo(GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.GROUND_Y);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Draw player with glow
  ctx.shadowColor = COLORS.PLAYER;
  ctx.shadowBlur = 15;
  ctx.fillStyle = COLORS.PLAYER;
  ctx.fillRect(
    GAME_CONFIG.PLAYER_X,
    playerY,
    GAME_CONFIG.PLAYER_WIDTH,
    GAME_CONFIG.PLAYER_HEIGHT,
  );
  ctx.shadowBlur = 0;

  // Draw player border
  ctx.strokeStyle = COLORS.NEON_BLUE;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    GAME_CONFIG.PLAYER_X,
    playerY,
    GAME_CONFIG.PLAYER_WIDTH,
    GAME_CONFIG.PLAYER_HEIGHT,
  );

  // Draw obstacles with glow
  obstacles.forEach((obstacle) => {
    ctx.shadowColor = COLORS.OBSTACLE;
    ctx.shadowBlur = 10;
    ctx.fillStyle = COLORS.OBSTACLE;
    ctx.fillRect(
      obstacle.x,
      obstacle.y,
      GAME_CONFIG.OBSTACLE_WIDTH,
      GAME_CONFIG.OBSTACLE_HEIGHT,
    );
    ctx.shadowBlur = 0;

    // Obstacle border
    ctx.strokeStyle = COLORS.NEON_RED;
    ctx.lineWidth = 1;
    ctx.strokeRect(
      obstacle.x,
      obstacle.y,
      GAME_CONFIG.OBSTACLE_WIDTH,
      GAME_CONFIG.OBSTACLE_HEIGHT,
    );
  });

  // Draw score
  ctx.fillStyle = COLORS.NEON_BLUE;
  ctx.font = 'bold 24px "Courier New"';
  ctx.fillText(`SCORE: ${score}`, 20, 40);

  // Draw difficulty
  ctx.fillStyle = COLORS.NEON_PURPLE;
  ctx.font = 'bold 16px "Courier New"';
  ctx.fillText(`DIFFICULTY: ${difficulty}`, 20, 70);
};

export const playSound = (frequency: number, duration: number = 100) => {
  if (typeof window === 'undefined') return;

  try {
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
    console.log('Audio context not supported');
  }
};
