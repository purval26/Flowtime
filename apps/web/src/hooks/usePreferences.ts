import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export function usePreferences() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [loading, setLoading] = useState(true);

  // 1. Load preferences from localStorage on mount
  useEffect(() => {
    const savedClassId = localStorage.getItem('flowtime_selected_class_id');
    const savedTheme = localStorage.getItem('flowtime_theme') as ThemeMode | null;

    if (savedClassId) setSelectedClassId(savedClassId);
    if (savedTheme) setTheme(savedTheme);

    setLoading(false);
  }, []);

  // 2. Synchronize HTML class with the active theme state
  useEffect(() => {
    if (loading) return;

    const applyTheme = () => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    // Listen to changes in system preferences if theme mode is set to 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme, loading]);

  const changeClassId = (classId: string | null) => {
    setSelectedClassId(classId);
    if (classId) {
      localStorage.setItem('flowtime_selected_class_id', classId);
    } else {
      localStorage.removeItem('flowtime_selected_class_id');
    }
  };

  const changeTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem('flowtime_theme', newTheme);
  };

  return {
    selectedClassId,
    changeClassId,
    theme,
    changeTheme,
    loading,
  };
}
