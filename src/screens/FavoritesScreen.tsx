import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../hooks';
import { selectFavoriteProducts } from '../selectors/productsSelectors';
import ProductItem from '../components/ProductItem';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useColorScheme } from 'react-native';
import { makeTheme } from '../theme/theme';

/**
 * Navigation type for this screen.
 * Ensures strong typing when navigating to other stack screens.
 */
type Nav = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

/**
 * FavoritesScreen
 * ----------------
 * Displays a list of favorite products saved by the user.
 * - If no favorites exist, shows an empty-state message.
 * - Each product item can be tapped to navigate to its detailed view.
 * - Uses optimized FlatList settings for performance.
 */
export default function FavoritesScreen() {
  // Load theme colors dynamically (light/dark mode)
  const t = makeTheme(useColorScheme());

  // Navigation object for stack navigation
  const nav = useNavigation<Nav>();

  // Select favorite products from Redux store
  const favorites = useAppSelector(selectFavoriteProducts);

  /**
   * Navigate to the ProductDetails screen for the selected product.
   * useCallback avoids unnecessary re-renders of child components.
   */
  const goToDetails = React.useCallback(
    (id: number) => {
      nav.navigate('ProductDetails', { id });
    },
    [nav],
  );

  /**
   * Show placeholder when the favorites list is empty.
   */
  if (favorites.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
        <Text style={{ color: t.colors.textMuted }}>No favorites yet.</Text>
      </View>
    );
  }

  /**
   * Render the list of favorite products.
   * FlatList provides lazy rendering and batch updates for better performance.
   */
  return (
    <FlatList
      contentContainerStyle={{ paddingVertical: 6, backgroundColor: t.colors.bg }}
      data={favorites}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ProductItem product={item} onPress={goToDetails} />
      )}
      // FlatList performance tuning:
      initialNumToRender={10}          // Number of items to render initially
      windowSize={5}                   // How many windows of items to render ahead
      maxToRenderPerBatch={10}         // Maximum number of items rendered per batch
      updateCellsBatchingPeriod={50}   // Batch update frequency (ms)
      removeClippedSubviews            // Improves performance by unmounting off-screen items
    />
  );
}

/**
 * Styles for layout consistency.
 */
const styles = StyleSheet.create({
  // Centered layout for empty state
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
