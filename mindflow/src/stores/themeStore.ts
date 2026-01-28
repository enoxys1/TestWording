import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeId = 'dark' | 'neon' | 'nature' | 'retro' | 'minimal' | 'ocean' | 'sunset' | 'monochrome';

export interface Theme {
  id: ThemeId;
  name: string;
  isPremium: boolean;
  colors: {
    background: string;
    surface: string;
    surfaceLight: string;
    primary: string;
    accent: string;
    text: string;
    textSecondary: string;
    correct: string;
    present: string;
    absent: string;
    border: string;
  };
}

export const themes: Record<ThemeId, Theme> = {
  dark: {
    id: 'dark',
    name: 'Dark',
    isPremium: false,
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      surfaceLight: '#334155',
      primary: '#6366f1',
      accent: '#06b6d4',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      correct: '#22c55e',
      present: '#eab308',
      absent: '#475569',
      border: '#334155',
    },
  },
  neon: {
    id: 'neon',
    name: 'Néon',
    isPremium: true,
    colors: {
      background: '#0a0a0a',
      surface: '#171717',
      surfaceLight: '#262626',
      primary: '#f0abfc',
      accent: '#22d3ee',
      text: '#fafafa',
      textSecondary: '#a3a3a3',
      correct: '#4ade80',
      present: '#facc15',
      absent: '#404040',
      border: '#404040',
    },
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    isPremium: true,
    colors: {
      background: '#14532d',
      surface: '#166534',
      surfaceLight: '#15803d',
      primary: '#86efac',
      accent: '#fbbf24',
      text: '#f0fdf4',
      textSecondary: '#bbf7d0',
      correct: '#4ade80',
      present: '#fbbf24',
      absent: '#365314',
      border: '#22c55e',
    },
  },
  retro: {
    id: 'retro',
    name: 'Rétro',
    isPremium: true,
    colors: {
      background: '#1a1c2c',
      surface: '#29366f',
      surfaceLight: '#3b5dc9',
      primary: '#f4f4f4',
      accent: '#73eff7',
      text: '#f4f4f4',
      textSecondary: '#94b0c2',
      correct: '#38b764',
      present: '#ffcd75',
      absent: '#333c57',
      border: '#41a6f6',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    isPremium: true,
    colors: {
      background: '#ffffff',
      surface: '#f5f5f5',
      surfaceLight: '#e5e5e5',
      primary: '#171717',
      accent: '#525252',
      text: '#171717',
      textSecondary: '#737373',
      correct: '#16a34a',
      present: '#ca8a04',
      absent: '#d4d4d4',
      border: '#e5e5e5',
    },
  },
  ocean: {
    id: 'ocean',
    name: 'Océan',
    isPremium: true,
    colors: {
      background: '#0c4a6e',
      surface: '#075985',
      surfaceLight: '#0369a1',
      primary: '#7dd3fc',
      accent: '#2dd4bf',
      text: '#f0f9ff',
      textSecondary: '#bae6fd',
      correct: '#34d399',
      present: '#fbbf24',
      absent: '#164e63',
      border: '#0ea5e9',
    },
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    isPremium: true,
    colors: {
      background: '#7c2d12',
      surface: '#9a3412',
      surfaceLight: '#c2410c',
      primary: '#fed7aa',
      accent: '#fbbf24',
      text: '#fff7ed',
      textSecondary: '#fdba74',
      correct: '#86efac',
      present: '#fde047',
      absent: '#431407',
      border: '#ea580c',
    },
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    isPremium: true,
    colors: {
      background: '#000000',
      surface: '#171717',
      surfaceLight: '#262626',
      primary: '#ffffff',
      accent: '#a3a3a3',
      text: '#ffffff',
      textSecondary: '#737373',
      correct: '#d4d4d4',
      present: '#737373',
      absent: '#262626',
      border: '#404040',
    },
  },
};

interface ThemeState {
  currentTheme: ThemeId;
  purchasedThemes: ThemeId[];
  setTheme: (theme: ThemeId) => void;
  purchaseTheme: (theme: ThemeId) => void;
  hasTheme: (theme: ThemeId) => boolean;
  getTheme: () => Theme;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'dark',
      purchasedThemes: ['dark'], // Dark is free

      setTheme: (theme) => {
        if (get().hasTheme(theme)) {
          set({ currentTheme: theme });
        }
      },

      purchaseTheme: (theme) => {
        set((state) => ({
          purchasedThemes: [...new Set([...state.purchasedThemes, theme])],
        }));
      },

      hasTheme: (theme) => {
        const state = get();
        return state.purchasedThemes.includes(theme) || !themes[theme].isPremium;
      },

      getTheme: () => themes[get().currentTheme],
    }),
    {
      name: 'mindflow-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
