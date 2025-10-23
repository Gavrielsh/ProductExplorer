import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer, { toggleFavorite } from '../slices/productsSlice';
import AppNavigator from '../navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '../theme/ThemeProvider';

// Mock Ionicons
jest.mock('react-native-vector-icons/Ionicons', () => require('./__mocks__/Ionicons'));

function renderTabsWithFavs(n: number) {
  const store = configureStore({ reducer: { products: productsReducer } });
  for (let i = 1; i <= n; i++) store.dispatch(toggleFavorite(i));
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}

test('tab badge reflects favorites count', () => {
  const { getByText } = renderTabsWithFavs(3);
  // tab bar badge is rendered as a simple text node with the count
  getByText('3');
});
