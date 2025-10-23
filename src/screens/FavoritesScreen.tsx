import React, { useCallback } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator'; // Ensure the path is correct
import { useAppSelector } from '../hooks';
import { useTheme } from '../theme/ThemeProvider';
import ProductItem from '../components/ProductItem';

/**
 * Defines the navigation prop type for the FavoritesScreen.
 * This ensures type safety when using navigation actions like `Maps`.
 * It uses the shared RootStackParamList but specifies 'FavoritesList' as the current route name
 * within its own stack (FavoritesStack).
 */
type FavoritesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList, // Reuses the same ParamList as HomeStack for consistency
  'FavoritesList'     // The name assigned to this screen within the FavoritesStack
>;

/**
 * FavoritesScreen Component
 * -------------------------
 * Displays a list of products that the user has marked as favorites.
 *
 * Features:
 * - Selects the full product list (`items`) and favorite IDs (`favIds`) from the Redux store.
 * - Filters the items list to derive the actual favorite product objects.
 * - Renders the list using `FlatList` for optimal performance with potentially long lists.
 * - Utilizes the reusable `ProductItem` component to display each favorite product card.
 * - Handles navigation to the `ProductDetailsScreen` when a `ProductItem` is pressed.
 * - Displays a centered "No favorites yet" message if the favorites list is empty.
 * - Adapts its styling based on the current theme (light/dark) using the `useTheme` hook.
 */
export default function FavoritesScreen() {
  const t = useTheme();
  // --- Get the navigation object ---
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  // -------------------------

  // Select data from Redux store
  const items = useAppSelector((s) => s.products.items);
  const favIds = useAppSelector((s) => s.products.favorites);

  // Derive the list of favorite product objects
  const favs = items.filter((p) => favIds.includes(p.id));

  /**
   * Callback function to navigate to the Product Details screen.
   * Uses useCallback for memoization, preventing unnecessary re-creation on re-renders.
   * @param {number} id - The ID of the product to navigate to.
   */
  const openDetails = useCallback(
    (id: number) => {
      navigation.navigate('ProductDetails', { id });
    },
    [navigation] // Dependency array includes navigation
  );
  // ------------------------------------

  return (
    <View style={[styles.container, { backgroundColor: t.colors.bg }]}>
      {favs.length === 0 ? (
        // Display empty state message if no favorites exist
        <View style={styles.center}>
          <Text style={[styles.emptyText, { color: t.colors.textMuted }]}>
            No favorites yet.
          </Text>
        </View>
      ) : (
        // Display the list of favorite products
        <FlatList
          data={favs}
          keyExtractor={(item) => String(item.id)} // Use product ID as the key
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              // --- Pass the correct press handler ---
              onPress={openDetails} // Navigate to details on press
              // ---------------------------------
            />
          )}
          contentContainerStyle={styles.listContent} // Apply padding to the list container
        />
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the view takes up the full screen
  },
  center: {
    flex: 1,
    alignItems: 'center', // Center content horizontally
    justifyContent: 'center', // Center content vertically
  },
  emptyText: {
    fontWeight: '700', // Make the empty state text bold
    fontSize: 16,      // Slightly larger font size
  },
  listContent: {
    paddingVertical: 6, // Add vertical padding around the list items
  },
});