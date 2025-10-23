// src/__tests__/themeToggle.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/productsSlice';
import HomeScreen from '../screens/HomeScreen';
import { ThemeProvider } from '../theme/ThemeProvider';
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';

// Keep RN intact but mock useColorScheme
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return { ...RN, useColorScheme: () => 'light' };
});

// Mock Settings to avoid TurboModule warnings
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

// Mock axios so HomeScreen leaves loading state quickly
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

function renderHome() {
  const store = configureStore({ reducer: { products: productsReducer } });
  return render(
    <Provider store={store}>
      <ThemeProvider>
        <NavigationContainer>
          <HomeScreen />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('Theme toggle', () => {
  it('button toggles label between Dark Mode / Light Mode', async () => {
    // Initial fetch resolves immediately with empty list (we just need the toolbar to render)
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    const { getByText } = renderHome();

    // Wait until loading spinner is gone and toolbar is rendered
    await waitFor(() => expect(getByText(/Dark Mode/i)).toBeTruthy());

    fireEvent.press(getByText(/Dark Mode/i));
    await waitFor(() => expect(getByText(/Light Mode/i)).toBeTruthy());
  });
});
