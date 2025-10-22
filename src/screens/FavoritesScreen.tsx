import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../hooks';
import { useTheme } from '../theme/ThemeProvider';
import ProductItem from '../components/ProductItem';

export default function FavoritesScreen() {
  const t = useTheme();
  const items = useAppSelector((s) => s.products.items);
  const favIds = useAppSelector((s) => s.products.favorites);
  const favs = items.filter((p) => favIds.includes(p.id));

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg }}>
      {favs.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: t.colors.textMuted, fontWeight: '700' }}>No favorites yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favs}
          keyExtractor={(i) => String(i.id)}
          renderItem={({ item }) => (
            <ProductItem
              product={item}
              onPress={() => {
                // Navigate via tab stack header button in details stack
                // Left as-is to keep this screen simple
              }}
            />
          )}
          contentContainerStyle={{ paddingVertical: 6 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
