import { createContext } from 'react';
import type { ThemeName } from './theme';

export const ThemeContext = createContext<{ theme: ThemeName; setTheme: (theme: ThemeName) => void } | null>(null);
