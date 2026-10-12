import light from '../../themes/light.json';
import dark from '../../themes/dark.json';

export type ThemeName = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'epfk-organizer:theme';
export const themePalettes = { light, dark } as const;

export function getInitialTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage may be disabled by the browser; use the operating-system preference.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(themeName: ThemeName) {
  const root = document.documentElement;
  const palette = themePalettes[themeName];
  root.dataset.theme = themeName;
  root.style.colorScheme = themeName;
  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty(`--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value);
  }
}
