import axios from 'axios';
import { configureStore, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import productsReducer, { toggleFavorite, fetchProducts } from '../slices/productsSlice';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

/**
 * Create a minimal test store with our products reducer only.
 * Using a bare store keeps tests fast and focused.
 */
function makeTestStore() {
  return configureStore({
    reducer: { products: productsReducer },
  });
}
type AppStore = ReturnType<typeof makeTestStore>;
type AppState = ReturnType<AppStore['getState']>;
type AppDispatch = ThunkDispatch<AppState, unknown, AnyAction>;

describe('productsSlice', () => {
  it('should have a sane initial state', () => {
    const store = makeTestStore();
    const state = store.getState().products;
    expect(state.items).toEqual([]);
    expect(state.favorites).toEqual([]);
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
  });

  it('toggleFavorite should add and then remove the id', () => {
    const store = makeTestStore();
    store.dispatch(toggleFavorite(123));
    expect(store.getState().products.favorites).toEqual([123]);
    store.dispatch(toggleFavorite(123));
    expect(store.getState().products.favorites).toEqual([]);
  });

  it('fetchProducts pending/fulfilled should populate items', async () => {
    const store = makeTestStore();
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ id: 1, title: 'A', price: 10, image: '', description: 'D', category: 'C' }],
    });

    const dispatch = store.dispatch as AppDispatch;
    const promise = dispatch(fetchProducts()); // pending
    expect(store.getState().products.status).toBe('loading');

    await promise; // fulfilled
    const s = store.getState().products;
    expect(s.status).toBe('succeeded');
    expect(s.items).toHaveLength(1);
    expect(s.items[0]!.id).toBe(1);
  });

  it('fetchProducts rejected should set error state', async () => {
    const store = makeTestStore();
    mockedAxios.get.mockRejectedValueOnce(new Error('network down'));

    const dispatch = store.dispatch as AppDispatch;
    await dispatch(fetchProducts()); // rejected
    const s = store.getState().products;
    expect(s.status).toBe('failed');
    expect(s.error).toBeTruthy();
  });
});
