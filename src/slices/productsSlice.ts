import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Product } from '../types/product';

/**
 * ProductsState
 * -------------
 * Centralized state for product data and UI status flags.
 * - items: normalized list of products fetched from the API.
 * - favorites: product IDs (not full objects) to avoid duplication.
 * - status: lifecycle of the async fetch for UI feedback.
 * - error: last fetch error message for non-blocking display.
 */
export interface ProductsState {
  /** All products returned from the API. Empty until fetchProducts resolves. */
  items: Product[];
  /** Product IDs marked as favorites (IDs only to avoid duplication). */
  favorites: number[];
  /** Async status flag used by screens to render loading/empty/error states. */
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  /** Last error message from a failed fetch (if any). */
  error: string | null;
}

/** Initial state of the products slice. */
const initialState: ProductsState = {
  items: [],
  favorites: [],
  status: 'idle',
  error: null,
};

/**
 * fetchProducts
 * -------------
 * RTK thunk that fetches products from FakeStore API.
 * - Dispatch flow: pending -> fulfilled|rejected (handled in extraReducers).
 * - Return value becomes `action.payload` in the fulfilled case.
 * - This thunk is idempotent at the call-site level; caller can safely re-dispatch
 *   (e.g., pull-to-refresh) and rely on status for UI rendering.
 *
 * Note: axios is used here, but any HTTP client would work.
 */
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axios.get<Product[]>('https://fakestoreapi.com/products');
  return response.data;
});

/**
 * productsSlice
 * -------------
 * Encapsulates reducers + actions for product list and favorites.
 * - `toggleFavorite`: add/remove a product ID in O(n) (array). For large lists,
 *   consider a Set in-memory (but keep serialization/back-compat in mind).
 * - `extraReducers`: updates status, data and error for the async thunk lifecycle.
 *
 * Screens consume:
 * - `status` to show loading spinners or empty states,
 * - `error` to show non-blocking messages,
 * - `items` for rendering,
 * - `favorites` for badges and filtering (via selectors).
 */
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    /**
     * Toggle a product ID in the favorites list.
     * If present -> remove; if absent -> add.
     * This is a pure UI preference toggle; it does not hit the network.
     */
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((fav) => fav !== id);
      } else {
        state.favorites.push(id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending: show loading, clear stale error
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      // Fulfilled: store fresh items and mark succeeded
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      // Rejected: record the reason and mark failed
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load';
      });
  },
});

export const { toggleFavorite } = productsSlice.actions;
export default productsSlice.reducer;
