// src/screens/HomeDashboard.tsx
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  GestureResponderEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import ThemeToggleButton from '../components/ThemeToggleButton';

/**
 * BigTile
 * -------
 * Reusable square tile with icon + label and a subtle press animation.
 */
type TileProps = {
  label: string;
  icon: string; // Ionicons icon name
  onPress: (e: GestureResponderEvent) => void;
};

const BigTile = ({ label, icon, onPress }: TileProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={[styles.tile, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: false }}
        style={styles.tileInner}
      >
        <Ionicons name={icon} size={40} />
        <Text style={styles.tileLabel}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

/**
 * HomeDashboard
 * -------------
 * Minimal home screen with two large buttons (Shop / Favorites)
 * and a floating ThemeToggleButton for Light/Dark mode.
 */
export default function HomeDashboard() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  // Navigate to product list inside the Home stack
  const goProducts = () => setTimeout(() => navigation.navigate('Products'), 90);

  // Navigate to Favorites tab (parent Tab navigator)
  const goFavorites = () =>
    setTimeout(() => navigation.getParent()?.navigate('FavoritesTab'), 90);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      {/* Floating theme toggle (top-right) */}
      <ThemeToggleButton style={styles.fab} />

      <Text style={[styles.title, { color: theme.colors.text, ...theme.typography.h1 }]}>
        Product Explorer
      </Text>

      <View style={styles.row}>
        <View style={[styles.tileWrap, theme.shadow]}>
          <BigTile label="Shop" icon="pricetags-outline" onPress={goProducts} />
        </View>
        <View style={[styles.tileWrap, theme.shadow]}>
          <BigTile label="Favorites" icon="heart-outline" onPress={goFavorites} />
        </View>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        Choose where to start
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  tileWrap: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(127,127,127,0.06)',
  },
  tile: {
    flex: 1,
    aspectRatio: 1, // Keeps each tile square
    borderRadius: 18,
    overflow: 'hidden',
  },
  tileInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  tileLabel: { fontSize: 16, fontWeight: '600' },
  subtitle: { textAlign: 'center', marginTop: 24 },
  fab: {
    position: 'absolute',
    top: 40,
    right: 24,
    zIndex: 10,
  },
});
