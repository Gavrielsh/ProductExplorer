/**
 * Screen test: HomeScreen fetches & renders list and supports search
 */

import React from 'react';
import axios from 'axios';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../test-utils';
import HomeScreen from '../screens/HomeScreen';

jest.mock('axios');
jest.mock('react-native-vector-icons/Ionicons');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HomeScreen', () => {
  it('fetches products and shows them in a list', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: 1, title: 'Blue Shirt', price: 10, description: 'x', image: 'i1' },
        { id: 2, title: 'Red Hat', price: 7, description: 'y', image: 'i2' },
      ],
    });

    renderWithProviders(<HomeScreen />, { withNavigation: true });

    await waitFor(() => {
      expect(screen.getByText('Blue Shirt')).toBeTruthy();
      expect(screen.getByText('Red Hat')).toBeTruthy();
    });

    // search filters list
    const search = screen.getByPlaceholderText(/search/i);
    fireEvent.changeText(search, 'hat');

    expect(screen.queryByText('Blue Shirt')).toBeNull();
    expect(screen.getByText('Red Hat')).toBeTruthy();
  });
});
