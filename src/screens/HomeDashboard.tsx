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

/**
 * BigTile Component
 * -----------------
 * A reusable square tile with icon + label and press animation.
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
 * HomeDashboard Screen
 * --------------------
 * Replaces the old HomeScreen with a clean dashboard layout.
 * Displays two large animated buttons:
 * 1. "Shop" – navigates to Products list
 * 2. "Favorites" – navigates to Favorites tab
 */
export default function HomeDashboard() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  // Navigate to the Products screen inside this stack
  const goProducts = () => setTimeout(() => navigation.navigate('Products'), 90);

  // Navigate to the Favorites tab (parent navigator)
  const goFavorites = () =>
    setTimeout(() => navigation.getParent()?.navigate('FavoritesTab'), 90);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
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
    aspectRatio: 1, // Keeps each tile perfectly square
    borderRadius: 18,
    overflow: 'hidden',
  },
  tileInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  tileLabel: { fontSize: 16, fontWeight: '600' },
  subtitle: { textAlign: 'center', marginTop: 24 },
});
