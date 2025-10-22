/**
 * Tests async flow + error handling of productsSlice
 */

import reducer, {
  fetchProducts,
  toggleFavorite,
  type ProductsState,
} from '../slices/productsSlice';
import axios from 'axios';
import { AnyAction } from '@reduxjs/toolkit';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const initial: ProductsState = {
  items: [],
  favorites: [],
  status: 'idle',
  error: null,
};

describe('productsSlice async & reducers', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, {} as AnyAction)).toEqual(initial);
  });

  it('toggleFavorite adds and removes ids', () => {
    const s1 = reducer(initial, toggleFavorite(10));
    expect(s1.favorites).toContain(10);

    const s2 = reducer(s1, toggleFavorite(10));
    expect(s2.favorites).toEqual([]);
  });

  it('fetchProducts -> fulfilled stores items and clears error', async () => {
    const products = [
      { id: 1, title: 'A', price: 10, description: 'd', image: 'img' },
      { id: 2, title: 'B', price: 20, description: 'd2', image: 'img2' },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: products });

    const dispatch = jest.fn();
    const getState = jest.fn();
    const thunk = fetchProducts();

    // pending
    let action = thunk(dispatch, getState, undefined) as unknown as Promise<any>;
    // Immediately check first call is pending
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: fetchProducts.pending.type }),
    );

    // finish
    const result = await action;
    expect(result.type).toBe(fetchProducts.fulfilled.type);
    expect(result.payload).toEqual(products);
  });

  it('fetchProducts -> rejected stores error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network down'));

    const dispatch = jest.fn();
    const getState = jest.fn();
    const thunk = fetchProducts();

    const result = await thunk(dispatch, getState, undefined);
    expect(result.type).toBe(fetchProducts.rejected.type);
  });
});
