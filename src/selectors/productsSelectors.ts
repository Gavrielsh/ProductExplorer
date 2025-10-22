import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Product } from '../types/product';

/**
 * selectProducts
 * --------------
 * Base selector: returns all products currently stored in state.
 */
export const selectProducts = (state: RootState): Product[] => state.products.items;

/**
 * selectFavorites
 * ---------------
 * Base selector: returns the list of favorite product IDs.
 */
export const selectFavorites = (state: RootState): number[] => state.products.favorites;

/**
 * selectFavoriteProducts
 * ----------------------
 * Memoized selector combining products and favorites:
 * - Uses reselect's createSelector to compute derived data efficiently.
 * - Returns only products whose IDs appear in the favorites array.
 * - Avoids unnecessary recomputation when state slices haven't changed.
 */
export const selectFavoriteProducts = createSelector(
  [selectProducts, selectFavorites],
  (items, favIds) => items.filter((p) => favIds.includes(p.id)),
);
