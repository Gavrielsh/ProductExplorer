import React, { useCallback, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, Pressable, Animated,
  Platform, ToastAndroid, Alert,
} from 'react-native';
import type { Product } from '../types/product';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleFavorite } from '../slices/productsSlice';
import { useTheme } from '../theme/ThemeProvider';

/** Props for the ProductItem component. */
interface Props {
  /** Product data object. */
  product: Product;
  /** Callback when the card is pressed. */
  onPress: (id: number) => void;
}

/**
 * ProductItem Component
 *
 * Displays a single product card with image, details, and favorite button.
 * Includes press animations (scale, wiggle) and favorite toggle feedback.
 *
 * @param {Props} props - Component props.
 */
function ProductItem({ product, onPress }: Props) {
  const t = useTheme();
  const dispatch = useAppDispatch();
  const isFav = useAppSelector((s) => s.products.favorites.includes(product.id));

  // Animation values for press feedback and favorite button pulse
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const favScale = useRef(new Animated.Value(1)).current;

  // Animation handlers (memoized)
  const triggerWiggle = useCallback(() => { Animated.sequence([ Animated.timing(rotationAnim, { toValue: 2, duration: 80, useNativeDriver: true }), Animated.timing(rotationAnim, { toValue: -2, duration: 80, useNativeDriver: true }), Animated.timing(rotationAnim, { toValue: 0, duration: 80, useNativeDriver: true }), ]).start(); }, [rotationAnim]);
  const resetRotation = useCallback(() => { Animated.timing(rotationAnim, { toValue: 0, duration: 50, useNativeDriver: true }).start(); }, [rotationAnim]);
  const animateScaleIn = useCallback(() => { Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 20, bounciness: 3 }).start(); }, [scale]);
  const animateScaleOut = useCallback(() => { Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 3 }).start(); }, [scale]);
  const pulse = useCallback(() => { favScale.setValue(0.9); Animated.spring(favScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start(); }, [favScale]);

  /** Interpolated rotation value for the wiggle effect transform. */
  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [-2, 2],
    outputRange: ['-1deg', '1deg'],
  });

  // Event Handlers (memoized)
  const handleCardPress = useCallback(() => onPress(product.id), [onPress, product.id]);
  const handleToggle = useCallback(() => {
    dispatch(toggleFavorite(product.id));
    pulse();
    const message = isFav ? 'Removed from favorites' : 'Added to favorites';
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  }, [dispatch, product.id, isFav, pulse]);

  return (
    <Animated.View style={{ transform: [{ scale }, { rotate: rotateInterpolate }] }}>
      <Pressable
        onPress={handleCardPress}
        onPressIn={() => {
          animateScaleIn();
          triggerWiggle();
        }}
        onPressOut={() => {
          animateScaleOut();
          resetRotation();
        }}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: t.colors.card, borderColor: t.colors.border },
          t.shadow,
          pressed && styles.cardPressed,
        ]}
      >
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.content}>
          <Text numberOfLines={2} style={[styles.title, { color: t.colors.text }]}>
            {product.title}
          </Text>
          <Text style={[styles.price, { color: t.colors.text }]}>
            ${product.price.toFixed(2)}
          </Text>
          <View style={styles.row}>
            <View style={[styles.pill, { backgroundColor: t.colors.primarySoft }]}>
              <Text style={styles.pillText}>
                {product.category ?? 'General'}
              </Text>
            </View>
            <Animated.View style={{ transform: [{ scale: favScale }] }}>
              <Pressable
                onPress={(e) => { e.stopPropagation?.(); handleToggle(); }}
                style={({ pressed }) => [
                  styles.favBtn,
                  { backgroundColor: isFav ? t.colors.secondary : t.colors.primary },
                  pressed && styles.favBtnPressed,
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

// Styles
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
  cardPressed: { opacity: 0.98 },
  image: { width: 84, height: 84, resizeMode: 'contain', borderRadius: 12 },
  content: { flex: 1, gap: 6, justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700' },
  price: { fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pillText: { color: '#4F46E5', fontWeight: '700', fontSize: 12 }, // primary color
  favBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  favBtnPressed: { opacity: 0.9 },
  favText: { color: '#fff', fontWeight: '800', fontSize: 12, letterSpacing: 0.2 },
});