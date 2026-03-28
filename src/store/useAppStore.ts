import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  selectedDirectory: string;
  setSelectedDirectory: (dir: string) => void;

  /* 排除词条列表 - 每个词条都会被移除 */
  excludeTags: string[];
  setExcludeTags: (tags: string[]) => void;
  addExcludeTag: (tag: string) => void;
  removeExcludeTag: (tag: string) => void;
  clearExcludeTags: () => void;

  /* 是否去除文件扩展名 */
  removeExtension: boolean;
  setRemoveExtension: (remove: boolean) => void;

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

      excludeTags: [],
      setExcludeTags: (tags) => set({ excludeTags: tags }),
      addExcludeTag: (tag) => set((state) => ({
        excludeTags: state.excludeTags.includes(tag)
          ? state.excludeTags
          : [...state.excludeTags, tag]
      })),
      removeExcludeTag: (tag) => set((state) => ({
        excludeTags: state.excludeTags.filter(t => t !== tag)
      })),
      clearExcludeTags: () => set({ excludeTags: [] }),

      removeExtension: true,
      setRemoveExtension: (remove) => set({ removeExtension: remove }),

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
        excludeTags: state.excludeTags,
        removeExtension: state.removeExtension,
      }),
    }
  )
);
