import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer, { toggleFavorite } from '../slices/productsSlice';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import { ThemeProvider } from '../theme/ThemeProvider';

// Mock navigation route params
const route = { params: { id: 7 } } as any;

function renderWithStore() {
  const store = configureStore({ reducer: { products: productsReducer } });
  // Seed one product
  store.dispatch({
    type: 'products/fetchProducts/fulfilled',
    payload: [{ id: 7, title: 'Item7', price: 99.99, image: '', description: 'desc', category: 'cat' }],
  });
  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider>
          <ProductDetailsScreen route={route} />
        </ThemeProvider>
      </Provider>,
    ),
    store,
  };
}

describe('ProductDetailsScreen', () => {
  it('renders product info and toggles favorite', () => {
    const { getByText, store } = renderWithStore();

    // Initially not favorite
    const btn = getByText(/Add to favorites/i);
    fireEvent.press(btn);
    // After toggle -> button text should change
    getByText(/Remove from favorites/i);

    // Verify store state reflects toggle
    const favs = (store.getState() as any).products.favorites;
    expect(favs).toContain(7);
  });

  it('shows "not found" when product is missing', () => {
    const store = configureStore({ reducer: { products: productsReducer } });
    const routeMissing = { params: { id: 1234 } } as any;

    const { getByText } = render(
      <Provider store={store}>
        <ThemeProvider>
          <ProductDetailsScreen route={routeMissing} />
        </ThemeProvider>
      </Provider>,
    );

    getByText(/Product not found/i);
  });
});
