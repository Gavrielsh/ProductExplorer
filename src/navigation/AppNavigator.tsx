import React from 'react';
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { useAppSelector } from '../hooks';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Defines the parameters expected by each screen in the Native Stack navigators.
 * - Home: No parameters expected for the main product list screen.
 * - ProductDetails: Expects an 'id' parameter (number) to identify the product.
 * - FavoritesList: No parameters expected for the favorites list screen.
 */
export type RootStackParamList = {
  Home: undefined;
  ProductDetails: { id: number };
  FavoritesList: undefined; // Renamed from Home in FavoritesStack for clarity
};

// Create navigator instances
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * HomeStack Component
 * -------------------
 * Manages the navigation stack for the "Home" tab.
 * Includes the main product list (HomeScreen) and the product details screen (ProductDetailsScreen).
 * Configures default screen options, including transition animations.
 */
function HomeStack() {
  const t = useTheme(); // Hook to access theme properties

  // Default screen options for this stack navigator
  const stackScreenOptions: NativeStackNavigationOptions = {
      headerStyle: { backgroundColor: t.colors.bg }, // Set header background based on theme
      headerTintColor: t.colors.text,              // Set header text/icon color based on theme
      contentStyle: { backgroundColor: t.colors.bg }, // Set screen background color based on theme
      animation: 'slide_from_right', // Default transition animation
      animationDuration: 350,        // Duration of the animation in milliseconds
      };

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      {/* Screen for displaying the list of all products */}
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Products' }} />
      {/* Screen for displaying the details of a single product */}
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
}

/**
 * FavoritesStack Component
 * ------------------------
 * Manages the navigation stack for the "Favorites" tab.
 * Includes the list of favorite products (FavoritesScreen) and the product details screen (ProductDetailsScreen).
 * Configures default screen options, mirroring the HomeStack's animations.
 */
function FavoritesStack() {
  const t = useTheme(); // Hook to access theme properties

  // Default screen options for this stack navigator
  const stackScreenOptions: NativeStackNavigationOptions = {
      headerStyle: { backgroundColor: t.colors.bg },
      headerTintColor: t.colors.text,
      contentStyle: { backgroundColor: t.colors.bg },
      animation: 'slide_from_right', // Default transition animation
      animationDuration: 350,        // Duration of the animation
  };

  return (
      <Stack.Navigator screenOptions={stackScreenOptions}>
          {/* Screen for displaying the list of favorited products */}
          <Stack.Screen
              name="FavoritesList" // Unique name for the favorites list screen within this stack
              component={FavoritesScreen}
              options={{ title: 'Favorites' }}
          />
          {/* Screen for displaying product details, accessible from favorites */}
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
  );
}

/**
 * AppNavigator Component
 * ----------------------
 * The main navigator for the application, using a Bottom Tab Navigator.
 * It contains two tabs: "Home" (using HomeStack) and "Favorites" (using FavoritesStack).
 * Configures the appearance and behavior of the bottom tabs based on the theme and favorite count.
 */
export default function AppNavigator() {
  const t = useTheme(); // Hook to access theme properties
  // Select the list of favorite product IDs from the Redux store to display the badge count
  const favorites = useAppSelector((s) => s.products.favorites);
  // Calculate badge value (only show if > 0)
  const badge = favorites.length ? String(favorites.length) : undefined;

  /**
   * Generates screen options for the Bottom Tab Navigator dynamically based on the route.
   * @param {object} route - The route object provided by React Navigation.
   * @returns {BottomTabNavigationOptions} Configuration options for the tab bar.
   */
  const tabScreenOptions = ({ route }: any): BottomTabNavigationOptions => ({
      headerShown: false, // Hide the default header provided by the Tab Navigator
      tabBarStyle: { backgroundColor: t.colors.card }, // Style the tab bar background using theme
      tabBarActiveTintColor: t.colors.primary,      // Color for the active tab icon and label
      tabBarInactiveTintColor: t.colors.textMuted, // Color for inactive tab icons and labels

      /**
       * Renders the icon for each tab.
       * @param {object} props - Properties including color and size for the icon.
       * @param {string} props.color - The color of the icon (active or inactive).
       * @param {number} props.size - The size of the icon.
       * @returns {React.ReactElement} The Ionicons component instance.
       */
      tabBarIcon: ({ color, size }: { color: string, size: number }) => {
          // Determine icon name based on the route name
          const name = route.name === 'HomeTab' ? 'home-outline' : 'heart-outline';
          return <Ionicons name={name} size={size} color={color} />;
      },
  });

  return (
      <Tab.Navigator screenOptions={tabScreenOptions}>
          {/* Home Tab: Contains the HomeStack */}
          <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
          {/* Favorites Tab: Contains the FavoritesStack and displays a badge */}
          <Tab.Screen
            name="FavoritesTab"
            component={FavoritesStack}
            options={{
              title: 'Favorites',
              tabBarBadge: badge // Display the count of favorite items
            }}
          />
      </Tab.Navigator>
  );
}