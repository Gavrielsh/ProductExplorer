import React from 'react';
import {
  View,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts } from '../slices/productsSlice';
import { selectProducts } from '../selectors/productsSelectors';
import ProductItem from '../components/ProductItem';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useColorScheme } from 'react-native';
import { makeTheme } from '../theme/theme';

/**
 * Navigation type for "Home" stack screen.
 */
type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * HomeScreen
 * ----------
 * Fetches and displays a searchable list of products.
 * - On first mount (status === 'idle'), triggers a fetch.
 * - Allows searching by title/category (client-side filter).
 * - Supports pull-to-refresh and manual reload.
 * - Shows loading state, error banner, and empty-state UI.
 * - Uses FlatList performance tuning for smooth scrolling.
 */
export default function HomeScreen() {
  // Theme colors (light/dark) resolved at render-time
  const t = makeTheme(useColorScheme());

  // Nav + Redux boilerplate
  const nav = useNavigation<Nav>();
  const dispatch = useAppDispatch();

  // Global products state
  const products = useAppSelector(selectProducts);
  const status = useAppSelector((s) => s.products.status); // 'idle' | 'loading' | 'succeeded' | 'failed'
  const error = useAppSelector((s) => s.products.error);   // string | null

  // Local query state for client-side search
  const [query, setQuery] = React.useState('');
  const loading = status === 'loading';

  /**
   * Kick off initial fetch when slice status is 'idle'.
   * Guard prevents repeated fetching on re-render.
   */
  React.useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, status]);

  /**
   * Derived, memoized filtered list.
   * - Trims and lowercases the query
   * - Matches by title or category (if exists)
   */
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.category ?? '').toLowerCase().includes(q),
    );
  }, [products, query]);

  /**
   * Pull-to-refresh handler: re-dispatch fetchProducts.
   */
  const onRefresh = React.useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /**
   * Navigate to the details page for a given product id.
   * useCallback ensures stable reference for child props.
   */
  const goToDetails = React.useCallback(
    (id: number) => {
      nav.navigate('ProductDetails', { id });
    },
    [nav],
  );

  /**
   * Initial full-screen loading state (no products yet).
   */
  if (loading && products.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: t.colors.textMuted }}>
          Loading products…
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {/* Top bar with search input + manual reload button */}
      <View style={[styles.topBar, { backgroundColor: t.colors.bg }]}>
        <View
          style={[
            styles.searchWrap,
            { backgroundColor: t.colors.card, borderColor: t.colors.border },
          ]}
        >
          {/* Simple search icon (text glyph) to avoid extra deps */}
          <Text style={[styles.searchIcon, { color: t.colors.textMuted }]}>⌕</Text>
          <TextInput
            placeholder="Search products…"
            placeholderTextColor={t.colors.textMuted}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: t.colors.text }]}
            autoCorrect={false}
            // Note: consider adding 'autoCapitalize="none"' for consistency
          />
        </View>

        {/* Manual reload triggers fetchProducts regardless of status */}
        <Button title="Reload" onPress={() => dispatch(fetchProducts())} />
      </View>

      {/* Non-blocking error banner; list still renders if data exists */}
      {error ? (
        <Text style={[styles.error, { color: t.colors.danger }]}>
          Error: {error}
        </Text>
      ) : null}

      {/* Products list (filtered) with pull-to-refresh */}
      <FlatList
        contentContainerStyle={{ paddingVertical: 6 }}
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductItem product={item} onPress={goToDetails} />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        // FlatList performance knobs for medium-sized lists
        initialNumToRender={10}          // render a handful of rows ASAP
        windowSize={5}                   // reduce memory by limiting windows
        maxToRenderPerBatch={10}         // control batch rendering size
        updateCellsBatchingPeriod={50}   // throttle UI updates
        removeClippedSubviews            // unmount off-screen items (Android)
        // Empty-state when there are products loaded but none match the query
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={{ color: t.colors.textMuted }}>No products found.</Text>
          </View>
        }
      />
    </View>
  );
}

/**
 * Styles: minimal, layout-focused.
 */
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 6, gap: 8 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,
    height: 44,
  },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500' },
  error: { paddingHorizontal: 12, marginBottom: 6 },
});
