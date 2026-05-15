/**
 * Game State Management with Zustand
 */
import { create } from 'zustand';
import { GAME_CONFIG } from './gameConstants';

export interface GameState {
  score: number;
  gameState: string;
  playerY: number;
  playerVelocity: number;
  obstacles: Obstacle[];
  spawnCounter: number;
  difficulty: number;
  gameUnlocked: boolean;
  showReplayBtn: boolean;
  replayRequested: boolean;

  // Actions
  setScore: (score: number) => void;
  setGameState: (state: string) => void;
  setPlayerY: (y: number) => void;
  setPlayerVelocity: (velocity: number) => void;
  setObstacles: (obstacles: Obstacle[]) => void;
  setSpawnCounter: (counter: number) => void;
  setDifficulty: (difficulty: number) => void;
  setGameUnlocked: (unlocked: boolean) => void;
  setShowReplayBtn: (v: boolean) => void;
  setReplayRequested: (v: boolean) => void;
  resetGame: () => void;
}

export interface Obstacle {
  x: number;
  y: number;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  gameState: GAME_CONFIG.GAME_STATES.IDLE,
  playerY: GAME_CONFIG.PLAYER_Y,
  playerVelocity: 0,
  obstacles: [],
  spawnCounter: 0,
  difficulty: 1,
  gameUnlocked: false,
  showReplayBtn: false,
  replayRequested: false,

  setScore: (score) => set({ score }),
  setGameState: (gameState) => set({ gameState }),
  setPlayerY: (playerY) => set({ playerY }),
  setPlayerVelocity: (playerVelocity) => set({ playerVelocity }),
  setObstacles: (obstacles) => set({ obstacles }),
  setSpawnCounter: (spawnCounter) => set({ spawnCounter }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setGameUnlocked: (gameUnlocked) => {
    set({ gameUnlocked });
    if (typeof window !== 'undefined') {
      localStorage.setItem('gameUnlocked', JSON.stringify(gameUnlocked));
    }
  },
  setShowReplayBtn: (showReplayBtn) => set({ showReplayBtn }),
  setReplayRequested: (replayRequested) => set({ replayRequested }),

  resetGame: () =>
    set({
      score: 0,
      gameState: GAME_CONFIG.GAME_STATES.IDLE,
      playerY: GAME_CONFIG.PLAYER_Y,
      playerVelocity: 0,
      obstacles: [],
      spawnCounter: 0,
      difficulty: 1,
    }),
}));
