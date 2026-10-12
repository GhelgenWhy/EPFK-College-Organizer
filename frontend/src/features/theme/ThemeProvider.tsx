import { useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { useUser } from '@clerk/react';
import { ThemeContext } from './ThemeContext';
import { applyTheme, getInitialTheme, THEME_STORAGE_KEY, type ThemeName } from './theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [localTheme, setLocalTheme] = useState<ThemeName>(getInitialTheme);
  const [sessionOverride, setSessionOverride] = useState<ThemeName | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const clerkPreference = isLoaded && isSignedIn ? user?.unsafeMetadata.theme : undefined;
  const savedTheme: ThemeName | null = clerkPreference === 'Світла'
    ? 'light'
    : clerkPreference === 'Темна'
      ? 'dark'
      : null;
  const theme = sessionOverride ?? savedTheme ?? localTheme;

  const setTheme = useCallback((nextTheme: ThemeName) => {
    applyTheme(nextTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Keep the current session themed even when browser storage is unavailable.
    }
    setSessionOverride(nextTheme);
    setLocalTheme(nextTheme);
  }, []);

  useLayoutEffect(() => applyTheme(theme), [theme]);

  useEffect(() => {
    if (!savedTheme) return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, savedTheme);
    } catch {
      // Clerk remains the source of truth if browser storage is unavailable.
    }
  }, [savedTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
