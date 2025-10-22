import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleFavorite } from '../slices/productsSlice';
import { useTheme } from '../theme/ThemeProvider';

type Props = { route: { params: { id: number } } };

export default function ProductDetailsScreen({ route }: Props) {
  const t = useTheme();
  const { id } = route.params;

  const dispatch = useAppDispatch();
  const product = useAppSelector((s) => s.products.items.find((p) => p.id === id));
  const isFav = useAppSelector((s) => s.products.favorites.includes(id));

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
        <Text style={{ color: t.colors.textMuted, fontWeight: '700' }}>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: t.colors.bg }} contentContainerStyle={{ padding: 16 }}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={[styles.title, { color: t.colors.text }]}>{product.title}</Text>
      <Text style={[styles.price, { color: t.colors.text }]}>${product.price.toFixed(2)}</Text>
      <Text style={[styles.desc, { color: t.colors.text }]}>{product.description}</Text>

      <Pressable
        onPress={() => dispatch(toggleFavorite(product.id))}
        style={[
          styles.btn,
          { backgroundColor: isFav ? t.colors.secondary : t.colors.primary },
        ]}
      >
        <Text style={styles.btnText}>{isFav ? 'Remove from favorites' : 'Add to favorites'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 280, resizeMode: 'contain', borderRadius: 16, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '800', marginTop: 6 },
  price: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  desc: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
  btn: { paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '800' },
});
