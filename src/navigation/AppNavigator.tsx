import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { useAppSelector } from '../hooks';
import { useTheme } from '../theme/ThemeProvider';
import HomeDashboard from '../screens/HomeDashboard';

/**
 * RootStackParamList
 * ------------------
 * Defines all navigation parameters for this app.
 */
export type RootStackParamList = {
  Home: undefined;            // Dashboard
  Products: undefined;        // Product list
  ProductDetails: { id: number };
  FavoritesList: undefined;   // Favorites list
};

// Create navigator instances
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * HomeStack
 * ----------
 * Manages the navigation flow for the "Home" tab:
 * - HomeDashboard (main dashboard)
 * - Products (list of products)
 * - ProductDetails (product info)
 */
function HomeStack() {
  const t = useTheme();

  const stackScreenOptions: NativeStackNavigationOptions = {
    headerStyle: { backgroundColor: t.colors.bg },
    headerTintColor: t.colors.text,
    contentStyle: { backgroundColor: t.colors.bg },
    animation: 'slide_from_right',
    animationDuration: 350,
  };

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="Home"
        component={HomeDashboard}
        options={{ title: 'Home', headerShown: false }}
      />
      <Stack.Screen
        name="Products"
        component={HomeScreen}
        options={{ title: 'Products' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Details' }}
      />
    </Stack.Navigator>
  );
}

/**
 * FavoritesStack
 * ---------------
 * Handles the navigation flow for the "Favorites" tab:
 * - Favorites list
 * - Product details
 */
function FavoritesStack() {
  const t = useTheme();

  const stackScreenOptions: NativeStackNavigationOptions = {
    headerStyle: { backgroundColor: t.colors.bg },
    headerTintColor: t.colors.text,
    contentStyle: { backgroundColor: t.colors.bg },
    animation: 'slide_from_right',
    animationDuration: 350,
  };

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Details' }}
      />
    </Stack.Navigator>
  );
}

/**
 * AppNavigator
 * -------------
 * Main bottom-tab navigator that combines HomeStack and FavoritesStack.
 * It also displays a badge for favorite products count.
 */
export default function AppNavigator() {
  const t = useTheme();
  const favorites = useAppSelector((s) => s.products.favorites);
  const badge = favorites.length ? String(favorites.length) : undefined;

  const tabScreenOptions = ({ route }: any): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarStyle: { backgroundColor: t.colors.card },
    tabBarActiveTintColor: t.colors.primary,
    tabBarInactiveTintColor: t.colors.textMuted,
    tabBarIcon: ({ color, size }: { color: string; size: number }) => {
      const name = route.name === 'HomeTab' ? 'home-outline' : 'heart-outline';
      return <Ionicons name={name} size={size} color={color} />;
    },
  });

  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          title: 'Favorites',
          tabBarBadge: badge,
        }}
      />
    </Tab.Navigator>
  );
}
