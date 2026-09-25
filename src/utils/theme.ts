import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'rollcall_theme_preference';

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function getStoredTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {}
  return 'system';
}

export function applyThemeToDocument(mode: ThemeMode): 'light' | 'dark' {
  const resolved = mode === 'system' ? getSystemTheme() : mode;
  const root = document.documentElement;

  if (resolved === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  return resolved;
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => getStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    return applyThemeToDocument(getStoredTheme());
  });

  useEffect(() => {
    const resolved = applyThemeToDocument(theme);
    setResolvedTheme(resolved);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  // Listen to system changes if in 'system' mode
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const resolved = applyThemeToDocument('system');
        setResolvedTheme(resolved);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    // Cycles: system -> dark -> light -> system (or if dark toggles to light, light toggles to dark)
    if (theme === 'dark') {
      setThemeState('light');
    } else if (theme === 'light') {
      setThemeState('dark');
    } else {
      // If currently system, toggle to opposite of current resolved
      setThemeState(resolvedTheme === 'dark' ? 'light' : 'dark');
    }
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
  };
}
