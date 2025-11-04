// src/screens/HomeDashboard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../theme/ThemeProvider';
import { useAppSelector } from '../hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * HomeDashboard
 * -------------
 * Main dashboard screen with navigation cards to different sections.
 * Theme toggle button is in the header (via AppNavigator).
 */
export default function HomeDashboard() {
  const t = useTheme();
  const navigation = useNavigation<Nav>();
  const productsCount = useAppSelector((s) => s.products.items.length);
  const favoritesCount = useAppSelector((s) => s.products.favorites.length);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.colors.bg }]}
      contentContainerStyle={styles.content}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: t.colors.text }]}>
          Product Explorer
        </Text>
        <Text style={[styles.subtitle, { color: t.colors.textMuted }]}>
          Choose where to start
        </Text>
      </View>

      {/* Navigation Cards */}
      <View style={styles.cardsContainer}>
        {/* Products Card */}
        <Pressable
          onPress={() => navigation.navigate('Products')}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: t.colors.card,
              borderColor: t.colors.border,
              opacity: pressed ? 0.95 : 1,
            },
            t.shadow,
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${t.colors.primary}15` }]}>
            <Ionicons name="grid-outline" size={32} color={t.colors.primary} />
          </View>
          <Text style={[styles.cardTitle, { color: t.colors.text }]}>
            Products
          </Text>
          <Text style={[styles.cardDescription, { color: t.colors.textMuted }]}>
            {productsCount > 0 
              ? `Browse ${productsCount} available products` 
              : 'Browse our product catalog'}
          </Text>
          <View style={styles.arrow}>
            <Ionicons name="arrow-forward" size={20} color={t.colors.primary} />
          </View>
        </Pressable>

        {/* Favorites Card */}
        <Pressable
          onPress={() => navigation.navigate('FavoritesList')}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: t.colors.card,
              borderColor: t.colors.border,
              opacity: pressed ? 0.95 : 1,
            },
            t.shadow,
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${t.colors.secondary}15` }]}>
            <Ionicons name="heart-outline" size={32} color={t.colors.secondary} />
          </View>
          <Text style={[styles.cardTitle, { color: t.colors.text }]}>
            Favorites
          </Text>
          <Text style={[styles.cardDescription, { color: t.colors.textMuted }]}>
            {favoritesCount > 0 
              ? `${favoritesCount} items in your favorites` 
              : 'No favorites yet'}
          </Text>
          <View style={styles.arrow}>
            <Ionicons name="arrow-forward" size={20} color={t.colors.secondary} />
          </View>
        </Pressable>
      </View>

      {/* Stats Footer */}
      <View style={[styles.statsContainer, { backgroundColor: t.colors.card, borderColor: t.colors.border }]}>
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: t.colors.primary }]}>
            {productsCount}
          </Text>
          <Text style={[styles.statLabel, { color: t.colors.textMuted }]}>
            Products
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: t.colors.border }]} />
        <View style={styles.stat}>
          <Text style={[styles.statNumber, { color: t.colors.secondary }]}>
            {favoritesCount}
          </Text>
          <Text style={[styles.statLabel, { color: t.colors.textMuted }]}>
            Favorites
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    padding: 24,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
    position: 'relative',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  arrow: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 40,
  },
});