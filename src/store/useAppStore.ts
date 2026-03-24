import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  selectedDirectory: string;
  setSelectedDirectory: (dir: string) => void;

  excludePatterns: string;
  setExcludePatterns: (patterns: string) => void;

  extractedNames: string[];
  setExtractedNames: (names: string[]) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  language: 'zh' | 'en';
  toggleLanguage: () => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedDirectory: '',
      setSelectedDirectory: (dir) => set({ selectedDirectory: dir }),

      excludePatterns: '',
      setExcludePatterns: (patterns) => set({ excludePatterns: patterns }),

      extractedNames: [],
      setExtractedNames: (names) => set({ extractedNames: names }),

      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      language: 'zh',
      toggleLanguage: () => set((state) => ({ language: state.language === 'zh' ? 'en' : 'zh' })),

      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'nametoexcel-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
      }),
    }
  )
);