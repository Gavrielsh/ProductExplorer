import React from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import { makeTheme } from './theme';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  /** User-selected mode (system/light/dark) */
  mode: ThemeMode;
  /** Effective scheme after applying system vs. manual choice */
  effectiveScheme: Exclude<ColorSchemeName, null> | 'light' | 'dark';
  /** Full tokens/colors computed from effective scheme */
  theme: ReturnType<typeof makeTheme>;
  /** Switch between light/dark quickly (system -> light on first press) */
  toggle: () => void;
  /** Set a specific mode (system/light/dark) */
  setMode: (m: ThemeMode) => void;
};

const ThemeModeContext = React.createContext<ThemeContextValue | undefined>(undefined);

/**
 * ThemeProvider
 * -------------
 * Wrap the app with this provider to:
 * - Respect the OS color scheme when mode === 'system'
 * - Allow user to override with light/dark mode
 * - Expose `useTheme()` and `useThemeMode()` hooks across the tree
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme() ?? 'light';
  const [mode, setMode] = React.useState<ThemeMode>('system');

  const effectiveScheme = mode === 'system' ? system : mode;
  const theme = React.useMemo(() => makeTheme(effectiveScheme), [effectiveScheme]);

  const toggle = React.useCallback(() => {
    setMode((prev) => {
      if (prev === 'system') return 'light';
      return prev === 'light' ? 'dark' : 'light';
    });
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ mode, effectiveScheme, theme, toggle, setMode }),
    [mode, effectiveScheme, theme, toggle],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

/** Access computed colors/tokens */
export function useTheme() {
  const ctx = React.useContext(ThemeModeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx.theme;
}

/** Access/modify the mode and toggle */
export function useThemeMode() {
  const ctx = React.useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return { mode: ctx.mode, effectiveScheme: ctx.effectiveScheme, toggle: ctx.toggle, setMode: ctx.setMode };
}
