/**
 * Tests for products selectors (search + favorites mapping)
 */

import {
  selectProducts,
  selectFavorites,
  selectFavoriteProducts,
} from '../selectors/productsSelectors';

const state = {
  products: {
    items: [
      { id: 1, title: 'Blue Shirt', price: 12, description: 'x', image: 'i1' },
      { id: 2, title: 'Red Hat', price: 7, description: 'y', image: 'i2' },
      { id: 3, title: 'Green Shoes', price: 20, description: 'z', image: 'i3' },
    ],
    favorites: [2, 3],
    status: 'succeeded',
    error: null,
  },
};

describe('products selectors', () => {
  it('selectAllProducts returns items array', () => {
    expect(selectProducts(state as any)).toHaveLength(3);
  });

  it('selectFavoriteIds returns ids only', () => {
    expect(selectFavorites(state as any)).toEqual([2, 3]);
  });

  it('selectFavoriteProducts returns favorite product objects', () => {
    const favs = selectFavoriteProducts(state as any);
    expect(favs.map((p) => p.id)).toEqual([2, 3]);
  });

});
