// src/theme/theme.ts
import { ColorSchemeName } from 'react-native';

/**
 * AppTheme
 * --------
 * Type alias for the returned structure of makeTheme().
 * Useful for ensuring consistency across themed components.
 */
export type AppTheme = ReturnType<typeof makeTheme>;

/**
 * makeTheme
 * ----------
 * Factory function that builds a light or dark theme object.
 * - Accepts React Native's ColorSchemeName ('light' | 'dark' | null).
 * - Returns consistent design tokens for colors, spacing, radius, shadows, and typography.
 *
 * The theme is intentionally flat and minimal to fit small React Native apps.
 */
export const makeTheme = (mode: ColorSchemeName = 'light') => {
  const isDark = mode === 'dark';

  /**
   * Color palette
   * Core brand colors + adaptive background/text pairs.
   * The design uses an indigo primary and emerald secondary for a calm tone.
   */
  const palette = {
    primary: '#4F46E5',       // Indigo 600
    primarySoft: '#EEF2FF',   // Light indigo background for tags/pills
    secondary: '#10B981',     // Emerald 500 accent
    bg: isDark ? '#0B0F14' : '#F6F7FB', // Screen background
    card: isDark ? '#141A22' : '#FFFFFF', // Surface / card background
    border: isDark ? '#273142' : '#E5E7EB', // Divider or outline color
    text: isDark ? '#E5E7EB' : '#0F172A',   // Primary text color
    textMuted: isDark ? '#9CA3AF' : '#6B7280', // Secondary text
    danger: '#EF4444', // Error / destructive actions
  };

  /**
   * The returned theme object includes:
   * - isDark: boolean flag for conditional styling
   * - colors: color palette above
   * - radius: standardized border radii
   * - spacing: layout spacing scale
   * - shadow: elevation and shadow styling (different for dark/light)
   * - typography: predefined text styles
   */
  return {
    isDark,
    colors: palette,
    radius: { sm: 10, md: 14, lg: 20 },
    spacing: { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 },
    shadow: isDark
      ? {
          // Softer shadows for dark mode (avoid heavy contrast)
          elevation: 3,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
        }
      : {
          // Slightly stronger shadows in light mode
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 3 },
          shadowRadius: 8,
        },
    typography: {
      h1: { fontSize: 22, fontWeight: '800' as const },
      h2: { fontSize: 18, fontWeight: '700' as const },
      body: { fontSize: 14, fontWeight: '400' as const },
      bold: { fontSize: 14, fontWeight: '600' as const },
      small: { fontSize: 12, fontWeight: '400' as const },
    },
  };
};
