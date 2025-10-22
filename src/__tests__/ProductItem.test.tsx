import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../test-utils';
import ProductItem from '../components/ProductItem';

jest.mock('react-native-vector-icons/Ionicons');

const product = {
  id: 1,
  title: 'Test Product',
  price: 9.9,
  description: 'desc',
  image: 'img',
};

describe('ProductItem', () => {
  it('renders and toggles favorite', () => {
    const onPress = jest.fn();
    // אם יש גם onToggleFavorite בקומפוננטה שלך – תוסיף:
    // const onToggleFavorite = jest.fn();

    renderWithProviders(
      <ProductItem
        product={product as any}
        onPress={onPress}
        // onToggleFavorite={onToggleFavorite}
      />,
    );

    expect(screen.getByText('Test Product')).toBeTruthy();
      });
});