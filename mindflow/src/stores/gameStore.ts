import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../services/storage';

export type GameType = 'motus' | 'sudoku' | 'numbermatch' | 'anagram' | '2048';

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number | null;
  bestScore: number | null;
  currentStreak: number;
  maxStreak: number;
  lastPlayed: string | null;
}

export interface DailyChallenge {
  gameType: GameType;
  completed: boolean;
  score: number | null;
  time: number | null;
  date: string;
}

interface GameState {
  // Stats per game
  stats: Record<GameType, GameStats>;

  // Global streak
  globalStreak: number;
  lastGlobalPlay: string | null;

  // Daily challenges
  dailyChallenges: DailyChallenge[];

  // Actions
  updateGameStats: (game: GameType, won: boolean, time?: number, score?: number) => void;
  completeDailyChallenge: (game: GameType, score: number, time: number) => void;
  resetDailyChallenges: () => void;
  getStats: (game: GameType) => GameStats;
}

const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTime: null,
  bestScore: null,
  currentStreak: 0,
  maxStreak: 0,
  lastPlayed: null,
};

const getToday = () => new Date().toISOString().split('T')[0];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      stats: {
        motus: { ...defaultStats },
        sudoku: { ...defaultStats },
        numbermatch: { ...defaultStats },
        anagram: { ...defaultStats },
        '2048': { ...defaultStats },
      },

      globalStreak: 0,
      lastGlobalPlay: null,

      dailyChallenges: [],

      updateGameStats: (game, won, time, score) => {
        const today = getToday();

        set((state) => {
          const currentStats = state.stats[game];
          const lastPlayed = currentStats.lastPlayed;

          // Calculate streak
          let newStreak = currentStats.currentStreak;
          if (won) {
            if (lastPlayed === today) {
              // Already played today, keep streak
            } else if (lastPlayed === getPreviousDay(today)) {
              // Played yesterday, increment streak
              newStreak += 1;
            } else {
              // Streak broken, start new
              newStreak = 1;
            }
          }

          const newStats: GameStats = {
            gamesPlayed: currentStats.gamesPlayed + 1,
            gamesWon: currentStats.gamesWon + (won ? 1 : 0),
            bestTime: time !== undefined
              ? (currentStats.bestTime === null ? time : Math.min(currentStats.bestTime, time))
              : currentStats.bestTime,
            bestScore: score !== undefined
              ? (currentStats.bestScore === null ? score : Math.max(currentStats.bestScore, score))
              : currentStats.bestScore,
            currentStreak: newStreak,
            maxStreak: Math.max(currentStats.maxStreak, newStreak),
            lastPlayed: today,
          };

          // Update global streak
          let newGlobalStreak = state.globalStreak;
          if (won) {
            if (state.lastGlobalPlay === today) {
              // Already played today
            } else if (state.lastGlobalPlay === getPreviousDay(today)) {
              newGlobalStreak += 1;
            } else {
              newGlobalStreak = 1;
            }
          }

          return {
            stats: {
              ...state.stats,
              [game]: newStats,
            },
            globalStreak: newGlobalStreak,
            lastGlobalPlay: today,
          };
        });
      },

      completeDailyChallenge: (game, score, time) => {
        const today = getToday();

        set((state) => {
          const existingIndex = state.dailyChallenges.findIndex(
            (c) => c.gameType === game && c.date === today
          );

          if (existingIndex >= 0) {
            const updated = [...state.dailyChallenges];
            updated[existingIndex] = {
              ...updated[existingIndex],
              completed: true,
              score,
              time,
            };
            return { dailyChallenges: updated };
          }

          return {
            dailyChallenges: [
              ...state.dailyChallenges,
              { gameType: game, completed: true, score, time, date: today },
            ],
          };
        });
      },

      resetDailyChallenges: () => {
        const today = getToday();
        set((state) => ({
          dailyChallenges: state.dailyChallenges.filter((c) => c.date === today),
        }));
      },

      getStats: (game) => get().stats[game],
    }),
    {
      name: 'mindflow-game-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);

function getPreviousDay(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
}
