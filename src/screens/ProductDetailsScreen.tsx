import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleFavorite, fetchProducts } from '../slices/productsSlice';
import type { RootStackParamList } from '../navigation/AppNavigator';

/**
 * ProductDetailsScreen
 * --------------------
 * Displays a single product by id (from route params).
 * - Ensures data is available (fetches on first mount if store is empty).
 * - Handles loading, error, and "not found" states explicitly.
 * - Allows toggling the product as favorite.
 */
export default function ProductDetailsScreen() {
  // Typed route object (id comes from navigation)
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetails'>>();
  const dispatch = useAppDispatch();

  // Normalize route param to a number to be safe
  const id = Number(route.params?.id);

  // Pull required product state from Redux
  const { items, favorites, status, error } = useAppSelector((s) => s.products);

  /**
   * Resolve the product from the store by id.
   * Memoized to avoid recomputing on unrelated state changes.
   */
  const product = React.useMemo(() => items.find((p) => p.id === id), [items, id]);

  /**
   * One-time fetch on mount if store is empty and slice is idle.
   * This protects deep-link scenarios where the details screen is opened first.
   */
  React.useEffect(() => {
    if (items.length === 0 && status === 'idle') {
      dispatch(fetchProducts());
    }
    // Intentional single-run on mount (ESLint ignore acceptable here)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Initial "full screen" loading: no items yet and fetch in progress.
   */
  if (status === 'loading' && items.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading product…</Text>
      </View>
    );
  }

  /**
   * Error state after a failed fetch.
   * Note: keep message concise; list rendering lives elsewhere.
   */
  if (status === 'failed') {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'crimson' }}>Error: {error ?? 'Failed to load'}</Text>
      </View>
    );
  }

  /**
   * Not found: either invalid id or product absent in the list after load.
   */
  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  // Happy path: render details and allow favorite toggle
  const isFav = favorites.includes(product.id);
  const onToggle = () => dispatch(toggleFavorite(product.id));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Large product image */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Title and price (keep typography bold but compact) */}
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>

      {/* Description copy; long text scrolls naturally */}
      <Text style={styles.desc}>{product.description}</Text>

      {/* Primary action: add/remove from favorites */}
      <Button
        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        onPress={onToggle}
      />
    </ScrollView>
  );
}

/**
 * Styles: simple and readable; colors left neutral here.
 * (If theming is desired, mirror the pattern used in other screens.)
 */
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { padding: 16, gap: 12 },
  image: { width: '100%', height: 280, resizeMode: 'contain', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  price: { fontSize: 16 },
  desc: { fontSize: 14, color: '#333' },
});
