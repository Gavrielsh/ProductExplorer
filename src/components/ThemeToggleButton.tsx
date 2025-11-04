import React from 'react';
import { Pressable, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme, useThemeMode } from '../theme/ThemeProvider';

type Props = {
  /** Optional container style override */
  style?: StyleProp<ViewStyle>;
  /** Size of the icon (defaults to 20) */
  size?: number;
  /** Optional testID for e2e/tests */
  testID?: string;
  /** If true, uses a subtle border; good on cards and floating UIs (default: true) */
  bordered?: boolean;
  /** Optional onPress override (will call theme toggle if not provided) */
  onPress?: () => void;
};

/**
 * ThemeToggleButton
 * -----------------
 * Small, icon-only button to toggle between Light/Dark modes.
 * Safe to reuse across screens (floating or inline).
 */
export default function ThemeToggleButton({
  style,
  size = 20,
  testID,
  bordered = true,
  onPress,
}: Props) {
  const t = useTheme();
  const { mode, toggle } = useThemeMode();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Toggle theme"
      onPress={onPress ?? toggle}
      android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true }}
      style={({ pressed }) => [
        styles.base,
        bordered && styles.bordered,
        {
          backgroundColor: t.colors.card,
          borderColor: t.colors.border,
          opacity: pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <Ionicons
        name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
        size={size}
        color={t.colors.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
  },
});
