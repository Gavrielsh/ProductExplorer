import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/productsSlice';
import HomeScreen from '../screens/HomeScreen';
import { ThemeProvider } from '../theme/ThemeProvider';
import { NavigationContainer } from '@react-navigation/native';

// Minimal mock for Settings to avoid TurboModuleRegistry warnings/crashes in RN tests
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

// Mock only useColorScheme while keeping the rest of RN intact
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return { ...RN, useColorScheme: () => 'light' };
});

// Mock Ionicons (native)
jest.mock('react-native-vector-icons/Ionicons', () => require('./__mocks__/Ionicons'));

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

describe('Theme toggle', () => {
  it('button toggles label between Dark Mode / Light Mode', () => {
    const { getByText } = renderHome();

    // initial (system mocked to light) -> should show "Dark Mode" as the action
    const btn = getByText(/Dark Mode/i);
    fireEvent.press(btn);
    // after toggle -> "Light Mode"
    getByText(/Light Mode/i);
  });
});
