// Helper: renderWithProviders
// Wraps components in a Redux Provider (and optionally a NavigationContainer)
// for unit/integration testing in React Native.

import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';

/**
 * makeStore
 * ----------
 * Utility function to create a Redux store instance
 * configured with the products slice only.
 * - Accepts an optional preloaded state to seed test scenarios.
 * - Returns a fully configured store ready for use with Provider.
 */
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: { products: productsReducer },
    preloadedState: preloadedState as RootState,
  });
}

/**
 * RootState
 * ----------
 * Minimal state shape type for tests.
 * Mirrors the structure used in makeStore().
 */
export type RootState = {
  products: ReturnType<typeof productsReducer>;
};

/**
 * renderWithProviders
 * -------------------
 * Renders a component wrapped in Redux <Provider> for testing.
 * Optionally wraps with a <NavigationContainer> if the component
 * depends on React Navigation context.
 *
 * Parameters:
 * - ui: React element under test.
 * - options:
 *   - withNavigation (boolean): wrap with NavigationContainer if true.
 *   - preloadedState (Partial<RootState>): initial Redux state.
 *
 * Returns:
 * - store: reference to the Redux store (for assertions / dispatches)
 * - all utilities from RTL's render()
 *
 * Example usage:
 * ```
 * const { getByText, store } = renderWithProviders(<HomeScreen />, {
 *   withNavigation: true,
 *   preloadedState: { products: { items: [], favorites: [], status: 'idle', error: null } },
 * });
 * ```
 */
export function renderWithProviders(
  ui: React.ReactElement,
  { withNavigation = false, preloadedState }: Options = {},
) {
  const store = makeStore(preloadedState);

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      {withNavigation ? (
        <NavigationContainer>{children}</NavigationContainer>
      ) : (
        children
      )}
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper }) };
}

/**
 * Options
 * -------
 * Type definition for renderWithProviders options.
 */
type Options = {
  /** If true, wraps component in NavigationContainer. */
  withNavigation?: boolean;
  /** Optional Redux state override for testing. */
  preloadedState?: Partial<RootState>;
};
