import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/productsSlice';
import { ThemeProvider } from '../theme/ThemeProvider';

// Force the system scheme to 'light' so initial label is predictable
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return { ...RN, useColorScheme: () => 'light' };
});

function renderHome() {
  const store = configureStore({ reducer: { products: productsReducer } });
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </Provider>,
  );
}

describe('Theme toggle', () => {
  it('button toggles label between Dark Mode / Light Mode', () => {
    const { getByText } = renderHome();

    // In light mode (system mocked), initial label should invite to "Dark Mode"
    const toggleBtn = getByText(/Dark Mode/i);
    fireEvent.press(toggleBtn);
    // After toggle -> "Light Mode"
    getByText(/Light Mode/i);
  });
});
