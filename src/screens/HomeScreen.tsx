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
import { useTheme, useThemeMode } from '../theme/ThemeProvider';
import type { RootStackParamList } from '../navigation/AppNavigator';

/**
 * Navigation type for "Home" stack screen.
 */
type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * HomeScreen
 * ----------
 * - Search bar (separate)
 * - Separate top action bar with: Fetch + Theme toggle
 * - Pull-to-refresh and initial fetch
 * - FlatList perf tweaks
 */
export default function HomeScreen() {
  const t = useTheme();
  const { mode, toggle } = useThemeMode();
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();

  const status = useAppSelector((s) => s.products.status);
  const error = useAppSelector((s) => s.products.error);
  const items = useAppSelector(selectProducts);

  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const title = p.title?.toLowerCase() ?? '';
      const cat = p.category?.toLowerCase() ?? '';
      return title.includes(q) || cat.includes(q);
    });
  }, [items, query]);

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const onRefresh = React.useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onFetchPress = React.useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const openDetails = React.useCallback(
    (id: number) => navigation.navigate('ProductDetails', { id }),
    [navigation],
  );

  if (status === 'loading' && items.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
        <ActivityIndicator color={t.colors.primary} />
        <Text style={{ color: t.colors.text, marginTop: 8, fontWeight: '700' }}>Loading products…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {/* Search bar */}
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
        </View>
      </View>

      {/* Action bar: Fetch + Theme toggle */}
      <View style={[styles.actionBar, { backgroundColor: t.colors.bg }]}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={onFetchPress}
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: t.colors.primary },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.btnText}>Fetch</Text>
          </Pressable>

          <Pressable
            onPress={toggle}
            style={({ pressed }) => [
              styles.btn,
              { backgroundColor: t.colors.card, borderWidth: StyleSheet.hairlineWidth, borderColor: t.colors.border },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={[styles.btnText, { color: t.colors.text }]}>
              {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </Pressable>
        </View>
      </View>

      {error ? (
        <Text style={[styles.error, { color: t.colors.danger }]}>Error: {error}</Text>
      ) : null}

      {status !== 'loading' && filtered.length === 0 ? (
        <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
          <Text style={{ color: t.colors.textMuted, fontWeight: '700' }}>No products match your search.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ProductItem product={item} onPress={openDetails} />}
          refreshControl={
            <RefreshControl
              refreshing={status === 'loading'}
              onRefresh={onRefresh}
              tintColor={t.colors.primary}
              colors={[t.colors.primary]}
              progressBackgroundColor={t.colors.card}
            />
          }
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
  topBar: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4, gap: 8 },
  actionBar: { paddingHorizontal: 12, paddingBottom: 6 },
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

  btn: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.2 },
});
