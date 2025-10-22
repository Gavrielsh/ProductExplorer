
import productsReducer, {
  toggleFavorite,
  fetchProducts,
} from '../slices/productsSlice';
import type { ProductsState } from '../slices/productsSlice';
import axios from 'axios';
import { AnyAction } from '@reduxjs/toolkit';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('productsSlice', () => {
  const initialState: ProductsState = {
    items: [],
    favorites: [],
    status: 'idle',
    error: null,
  };

  it('should return the initial state', () => {
    expect(productsReducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it('should toggle a favorite ID', () => {
    const state1 = productsReducer(initialState, toggleFavorite(1));
    expect(state1.favorites).toContain(1);

    const state2 = productsReducer(state1, toggleFavorite(1));
    expect(state2.favorites).not.toContain(1);
  });

  it('should handle fetchProducts success', async () => {
    const mockData = [
      { id: 1, title: 'Test Product', price: 10, description: 'x', image: '' },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    const dispatch = jest.fn();
    const thunk = fetchProducts();
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(mockedAxios.get).toHaveBeenCalledWith('https://fakestoreapi.com/products');
    expect(result.payload).toEqual(mockData);
  });
});