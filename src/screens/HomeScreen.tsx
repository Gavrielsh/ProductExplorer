import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts } from '../slices/productsSlice';
import { selectProducts } from '../selectors/productsSelectors';
import ProductItem from '../components/ProductItem';
import { makeTheme } from '../theme/theme';
import type { RootStackParamList } from '../navigation/AppNavigator';

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
 * - Supports pull-to-refresh + a small Fetch button in the top bar.
 * - Shows loading state, error banner, and empty-state UI.
 * - Uses FlatList performance tuning for smooth scrolling.
 */
export default function HomeScreen() {
  const t = makeTheme();
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();

  const status = useAppSelector((s) => s.products.status);
  const error = useAppSelector((s) => s.products.error);
  const items = useAppSelector(selectProducts);

  // Local search query
  const [query, setQuery] = React.useState('');

  // Derived filtered list (by title/category)
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const title = p.title?.toLowerCase() ?? '';
      const cat = p.category?.toLowerCase() ?? '';
      return title.includes(q) || cat.includes(q);
    });
  }, [items, query]);

  // Initial fetch on first mount if idle
  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Pull-to-refresh handler
  const onRefresh = React.useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Explicit fetch (top-bar button)
  const onFetchPress = React.useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Navigate to details
  const openDetails = React.useCallback(
    (id: number) => navigation.navigate('ProductDetails', { id }),
    [navigation],
  );

  // Loading state (first load)
  if (status === 'loading' && items.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
        <ActivityIndicator color={t.colors.primary} />
        <Text style={{ color: t.colors.text, marginTop: 8, fontWeight: '700' }}>
          Loading products…
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {/* Top bar with search input and a small Fetch button */}
      <View style={[styles.topBar, { backgroundColor: t.colors.bg }]}>
        <View
          style={[
            styles.searchWrap,
            { backgroundColor: t.colors.card, borderColor: t.colors.border },
          ]}
        >
          <Text style={[styles.searchIcon, { color: t.colors.textMuted }]}>⌕</Text>
          <TextInput
            placeholder="Search products…"
            placeholderTextColor={t.colors.textMuted}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, { color: t.colors.text }]}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          <Pressable
            onPress={onFetchPress}
            style={({ pressed }) => [
              styles.fetchBtn,
              { backgroundColor: t.colors.primary },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.fetchText}>Fetch</Text>
          </Pressable>
        </View>
      </View>

      {/* Non-blocking error banner; list still renders if data exists */}
      {error ? (
        <Text style={[styles.error, { color: t.colors.danger }]}>
          Error: {error}
        </Text>
      ) : null}

      {/* Empty state */}
      {status !== 'loading' && filtered.length === 0 ? (
        <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
          <Text style={{ color: t.colors.textMuted, fontWeight: '700' }}>
            No products match your search.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductItem product={item} onPress={openDetails} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={onRefresh}
              tintColor={t.colors.primary}
              colors={[t.colors.primary]}
              progressBackgroundColor={t.colors.card}
            />
          }
          // Performance tuning for smoother lists
          initialNumToRender={10}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

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
  fetchBtn: {
    marginLeft: 8,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  fetchText: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.2 },
});
