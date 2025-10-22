import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import type { Product } from '../types/product';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleFavorite } from '../slices/productsSlice';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  product: Product;
  onPress: (id: number) => void;
}

function ProductItem({ product, onPress }: Props) {
  const t = useTheme();
  const dispatch = useAppDispatch();
  const isFav = useAppSelector((s) => s.products.favorites.includes(product.id));

  // Animation for card press feedback
  const scale = React.useRef(new Animated.Value(1)).current;
  const animateIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 20, bounciness: 3 }).start();
  const animateOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 3 }).start();

  // Pulse animation for favorite button
  const favScale = React.useRef(new Animated.Value(1)).current;
  const pulse = () => {
    favScale.setValue(0.9);
    Animated.spring(favScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  };

  const handleCardPress = React.useCallback(() => onPress(product.id), [onPress, product.id]);

  const handleToggle = React.useCallback(() => {
    dispatch(toggleFavorite(product.id));
    pulse();
    if (Platform.OS === 'android') {
      ToastAndroid.show(isFav ? 'Removed from favorites' : 'Added to favorites', ToastAndroid.SHORT);
    } else {
      Alert.alert(isFav ? 'Removed from favorites' : 'Added to favorites');
    }
  }, [dispatch, product.id, isFav]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={handleCardPress}
        onPressIn={animateIn}
        onPressOut={animateOut}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: t.colors.card, borderColor: t.colors.border },
          t.shadow,
          pressed && { opacity: 0.98 },
        ]}
      >
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.content}>
          <Text numberOfLines={2} style={[styles.title, { color: t.colors.text }]}>{product.title}</Text>
          <Text style={[styles.price, { color: t.colors.text }]}>${product.price.toFixed(2)}</Text>

          <View style={styles.row}>
            <View style={[styles.pill, { backgroundColor: t.colors.primarySoft }]}>
              <Text style={{ color: t.colors.primary, fontWeight: '700', fontSize: 12 }}>
                {product.category ?? 'General'}
              </Text>
            </View>

            <Animated.View style={{ transform: [{ scale: favScale }] }}>
              <Pressable
                onPress={(e) => { e.stopPropagation?.(); handleToggle(); }}
                style={({ pressed }) => [
                  styles.favBtn,
                  { backgroundColor: isFav ? t.colors.secondary : t.colors.primary },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.favText}>{isFav ? 'Favorited' : 'Favorite'}</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(ProductItem);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    gap: 12,
  },
  image: { width: 84, height: 84, resizeMode: 'contain', borderRadius: 12 },
  content: { flex: 1, gap: 6, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700' },
  price: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  favBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  favText: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.2 },
});
