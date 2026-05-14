/**
 * Game Constants and Configuration
 */

export const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,

  // Player
  PLAYER_X: 100,
  PLAYER_Y: 280,
  PLAYER_WIDTH: 30,
  PLAYER_HEIGHT: 40,
  PLAYER_SPEED: 5,

  // Gravity and jumping
  GRAVITY: 0.6,
  JUMP_POWER: -15,
  MAX_FALL_SPEED: 15,

  // Obstacles
  OBSTACLE_WIDTH: 30,
  OBSTACLE_HEIGHT: 50,
  OBSTACLE_SPEED_START: 7,
  OBSTACLE_SPEED_MAX: 12,
  OBSTACLE_SPAWN_INTERVAL_START: 120,
  OBSTACLE_SPAWN_INTERVAL_MIN: 60,

  // Ground
  GROUND_Y: 330,

  // Scoring
  POINTS_PER_OBSTACLE: 10,
  WIN_SCORE: 100,
  DIFFICULTY_INCREASE_INTERVAL: 100, // Points between difficulty increases

  // Game states
  GAME_STATES: {
    IDLE: 'idle',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    WON: 'won',
  },
};

export const COLORS = {
  BACKGROUND: '#0a0e27',
  GRID: '#00ffff',
  PLAYER: '#ff00ff',
  OBSTACLE: '#ff0080',
  GROUND: '#00ff00',
  TEXT: '#00ffff',
  ACCENT: '#ff00ff',
  NEON_BLUE: '#00ffff',
  NEON_PURPLE: '#ff00ff',
  NEON_GREEN: '#00ff00',
  NEON_RED: '#ff0080',
};
