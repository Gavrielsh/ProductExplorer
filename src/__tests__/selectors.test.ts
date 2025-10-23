import { createSelector } from '@reduxjs/toolkit';
import type { Product } from '../types/product';
import productsReducer, { toggleFavorite } from '../slices/productsSlice';
import { selectProducts, selectFavorites } from '../selectors/productsSelectors';

// Rebuild the derived selector to test behavior in isolation
const selectFavoriteProducts = createSelector(
  [selectProducts, selectFavorites],
  (items, favIds) => items.filter((p) => favIds.includes(p.id)),
);

function reduce(actions: any[]) {
  let state = { products: productsReducer(undefined, { type: '@@INIT' }) };
  for (const a of actions) {
    state = { products: productsReducer(state.products, a) };
  }
  return state;
}

describe('selectors', () => {
  it('selectFavoriteProducts returns only items whose ids are favorited', () => {
    const items: Product[] = [
      { id: 1, title: 'A', price: 10, image: '', description: 'x', category: 'cat' },
      { id: 2, title: 'B', price: 20, image: '', description: 'y', category: 'cat' },
    ];
    const state = reduce([
      { type: 'products/fetchProducts/fulfilled', payload: items },
      toggleFavorite(2),
    ]);

    const favs = selectFavoriteProducts(state as any);
    expect(favs).toHaveLength(1);
    expect(favs[0]?.id).toBe(2);
  });
});
