import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* 条件组接口 - 组内标签为 AND 关系，组间为 OR 关系 */
export interface ExcludeCondition {
  id: string;
  tags: string[];
}

interface AppState {
  selectedDirectory: string;
  setSelectedDirectory: (dir: string) => void;

  /* 新的条件组状态 - 向后兼容旧的逗号分隔字符串 */
  excludeConditions: ExcludeCondition[];
  setExcludeConditions: (conditions: ExcludeCondition[]) => void;
  /* 保留旧字段用于向后兼容 */
  excludePatterns: string;
  setExcludePatterns: (patterns: string) => void;

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

let conditionIdCounter = 0;
const generateConditionId = () => `condition_${++conditionIdCounter}_${Date.now()}`;

/* 将条件组转换为逗号分隔字符串（用于向后兼容） */
export const conditionsToPatternString = (conditions: ExcludeCondition[]): string => {
  if (conditions.length === 0) return '';
  if (conditions.length === 1 && conditions[0].tags.length <= 1) {
    return conditions[0].tags.join(', ');
  }
  return conditions.map(c => c.tags.join('&&')).join('||');
};

/* 将逗号分隔字符串转换为条件组（用于向后兼容旧输入） */
export const patternStringToConditions = (pattern: string): ExcludeCondition[] => {
  if (!pattern.trim()) return [];

  const trimmed = pattern.trim();

  /* 检查是否包含 || 或 && - 如果是新的表达式格式 */
  if (trimmed.includes('||') || trimmed.includes('&&')) {
    const groups = trimmed.split('||');
    return groups.map(group => ({
      id: generateConditionId(),
      tags: group.split('&&').map(t => t.trim()).filter(t => t)
    })).filter(c => c.tags.length > 0);
  }

  /* 旧的逗号分隔格式 - 单个组，多个标签（AND 关系） */
  const tags = trimmed.split(',').map(t => t.trim()).filter(t => t);
  if (tags.length === 0) return [];

  return [{
    id: generateConditionId(),
    tags
  }];
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedDirectory: '',
      setSelectedDirectory: (dir) => set({ selectedDirectory: dir }),

      excludeConditions: [],
      setExcludeConditions: (conditions) => set({
        excludeConditions: conditions,
        excludePatterns: conditionsToPatternString(conditions)
      }),

      excludePatterns: '',
      setExcludePatterns: (patterns) => set({
        excludePatterns: patterns,
        excludeConditions: patternStringToConditions(patterns)
      }),

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
        excludePatterns: state.excludePatterns,
        removeExtension: state.removeExtension,
      }),
    }
  )
);
