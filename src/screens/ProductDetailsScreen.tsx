import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { toggleFavorite } from '../slices/productsSlice';
import { useTheme } from '../theme/ThemeProvider'; // Make sure useTheme is imported

// Define the type for the route prop, expecting an 'id' parameter
type Props = { route: { params: { id: number } } };

export default function ProductDetailsScreen({ route }: Props) {
  // --- Use theme hook ---
  const t = useTheme(); // Access theme tokens
  // --------------------

  const { id } = route.params;

  const dispatch = useAppDispatch();
  // Find the product by ID from the Redux store
  const product = useAppSelector((s) => s.products.items.find((p) => p.id === id));
  // Check if the product is in the favorites list
  const isFav = useAppSelector((s) => s.products.favorites.includes(id));

  // --- Handle product not found state ---
  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: t.colors.bg }]}>
        <Text style={[styles.notFoundText, { color: t.colors.textMuted }]}>
          Product not found.
        </Text>
      </View>
    );
  }
  // ------------------------------------

  return (
    // --- Apply theme background and padding ---
    <ScrollView
      style={[styles.container, { backgroundColor: t.colors.bg }]}
      contentContainerStyle={[styles.contentContainer, { padding: t.spacing.md }]} // Use theme spacing
    >
      {/* --- Image Container (optional card style) --- */}
      <View style={[styles.imageContainer, { backgroundColor: t.colors.card, borderRadius: t.radius.lg }, t.shadow]}>
        <Image
          source={{ uri: product.image }}
          style={[styles.image, { borderRadius: t.radius.lg }]} // Use theme radius
        />
      </View>
      {/* ------------------------------------------- */}

      {/* --- Text Content --- */}
      <Text style={[styles.title, t.typography.h1, { color: t.colors.text, marginTop: t.spacing.lg }]}>
        {product.title}
      </Text>
      <Text style={[styles.price, t.typography.h2, { color: t.colors.primary, marginBottom: t.spacing.sm }]}>
        ${product.price.toFixed(2)}
      </Text>
      <Text style={[styles.desc, t.typography.body, { color: t.colors.textMuted, marginBottom: t.spacing.xl }]}>
        {product.description}
      </Text>
      {/* -------------------- */}


      {/* --- Favorite Button --- */}
      <Pressable
        onPress={() => dispatch(toggleFavorite(product.id))}
        style={({ pressed }) => [ // Add pressed state feedback
          styles.btn,
          {
            backgroundColor: isFav ? t.colors.secondary : t.colors.primary, // Dynamic background color
            borderRadius: t.radius.md, // Use theme radius
          },
          pressed && styles.btnPressed, // Apply opacity when pressed
        ]}
      >
        <Text style={[styles.btnText, t.typography.bold]}> {/* Use theme typography */}
          {isFav ? 'Remove from favorites' : 'Add to favorites'}
        </Text>
      </Pressable>
      {/* ---------------------- */}
    </ScrollView>
  );
}

// --- Updated StyleSheet using theme values ---
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure ScrollView takes full height
  },
  contentContainer: {
    paddingBottom: 40, // Add extra padding at the bottom
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: { // Style for the 'Product not found' text
    // Using typography from theme is good practice here too
    // Example: ...t.typography.h2,
    fontWeight: '700',
    fontSize: 18,
  },
  imageContainer: {
    // Optional container for shadow and card background
    marginBottom: 12, // Keep some space below the image container
    // Shadow applied dynamically via t.shadow
  },
  image: {
    width: '100%',
    height: 300, // Adjusted height for details screen
    resizeMode: 'contain',
    // borderRadius applied dynamically
  },
  title: {
    // Uses t.typography.h1 and theme color dynamically
    textAlign: 'center', // Center align title
  },
  price: {
    // Uses t.typography.h2 and theme color dynamically
    textAlign: 'center', // Center align price
  },
  desc: {
    // Uses t.typography.body and theme color dynamically
    lineHeight: 22, // Slightly increased line height for readability
  },
  btn: {
    paddingVertical: 14, // Slightly larger vertical padding
    paddingHorizontal: 20, // Horizontal padding
    alignItems: 'center',
    marginTop: 8,
    // backgroundColor and borderRadius applied dynamically
  },
  btnPressed: {
    opacity: 0.85, // Feedback on press
  },
  btnText: {
    color: '#fff', // White text for buttons
    // Uses t.typography.bold dynamically
    letterSpacing: 0.5, // Add slight letter spacing
  },
});