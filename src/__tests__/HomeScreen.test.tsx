import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../slices/productsSlice';
import HomeScreen from '../screens/HomeScreen';
import { ThemeProvider } from '../theme/ThemeProvider';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Ionicons to avoid native dependency in tests
jest.mock('react-native-vector-icons/Ionicons', () => require('./__mocks__/Ionicons'));

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({ reducer: { products: productsReducer } });
  return {
    ...render(
      <Provider store={store}>
        <ThemeProvider>
          <NavigationContainer>{ui}</NavigationContainer>
        </ThemeProvider>
      </Provider>
    ),
    store,
  };
}

describe('HomeScreen', () => {
  it('fetch button triggers API call and renders items', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ id: 1, title: 'Alpha', price: 11, image: '', description: 'd', category: 'c' }],
    });

    const { getByText, queryByText } = renderWithStore(<HomeScreen />);

    // First render (status=idle) triggers initial fetch
    await waitFor(() => expect(getByText(/Alpha/i)).toBeTruthy());

    // Press explicit Fetch button -> should refetch
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 2, title: 'Beta', price: 22, image: '', description: 'd', category: 'c' },
        { id: 3, title: 'Gamma', price: 33, image: '', description: 'd', category: 'c' },
      ],
    });
    fireEvent.press(getByText('Fetch'));

    await waitFor(() => expect(getByText(/Beta/i)).toBeTruthy());
    expect(queryByText(/Alpha/i)).toBeFalsy();
  });

  it('search filters the list locally', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 1, title: 'Phone', price: 10, image: '', description: 'd', category: 'tech' },
        { id: 2, title: 'Chair', price: 20, image: '', description: 'd', category: 'home' },
      ],
    });

    const { getByPlaceholderText, getByText, queryByText } = renderWithStore(<HomeScreen />);
    await waitFor(() => getByText(/Phone/i));

    fireEvent.changeText(getByPlaceholderText(/Search products/i), 'Cha');
    expect(getByText(/Chair/i)).toBeTruthy();
    expect(queryByText(/Phone/i)).toBeFalsy();
  });

  it('shows error banner when fetch fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('boom'));

    const { findByText } = renderWithStore(<HomeScreen />);
    // After initial effect, state -> failed, error banner should appear
    expect(await findByText(/Error:/i)).toBeTruthy();
  });
});
