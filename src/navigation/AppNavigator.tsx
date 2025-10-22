import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '../hooks';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { useColorScheme } from 'react-native';
import { makeTheme } from '../theme/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * Root navigation param list for stack screens.
 */
export type RootStackParamList = {
  Home: undefined;
  ProductDetails: { id: number };
  Favorites: undefined;
};

const HomeStack = createNativeStackNavigator<RootStackParamList>();
const FavStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

/**
 * Stack for the "Home" flow: list -> details.
 */
function HomeStackScreen() {
  const t = makeTheme(useColorScheme());
  return (
    <HomeStack.Navigator
      screenOptions={{
        // Consistent themed header styling
        headerTitleStyle: { color: t.colors.text, fontWeight: '800' },
        headerStyle: { backgroundColor: t.colors.bg },
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Product Explorer' }}
      />
      <HomeStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product' }}
      />
    </HomeStack.Navigator>
  );
}

/**
 * Stack for the "Favorites" flow: favorites list -> details.
 */
function FavoritesStack() {
  const t = makeTheme(useColorScheme());
  return (
    <FavStack.Navigator
      screenOptions={{
        headerTitleStyle: { color: t.colors.text, fontWeight: '800' },
        headerStyle: { backgroundColor: t.colors.bg },
      }}
    >
      <FavStack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <FavStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ title: 'Product' }}
      />
    </FavStack.Navigator>
  );
}

/**
 * Root app navigator using bottom tabs.
 * - Each tab hosts its own stack to keep navigation history per tab.
 * - Tab badge reflects number of favorites.
 */
export default function AppNavigator() {
  const t = makeTheme(useColorScheme());
  const favCount = useAppSelector((s) => s.products.favorites.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Stacks manage their own headers
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.textMuted,
        tabBarStyle: { backgroundColor: t.colors.card, borderTopColor: t.colors.border },
        tabBarLabelStyle: { fontWeight: '700' },

        // Icon per tab (filled when focused, outline otherwise)
        tabBarIcon: ({ color, focused }) => {
          const name =
            route.name === 'HomeTab'
              ? focused
                ? 'home'
                : 'home-outline'
              : focused
                ? 'heart'
                : 'heart-outline';
          return <Ionicons name={name} size={22} color={color} />;
        },
      })}
    >
      {/* Home tab hosts the home stack */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{ title: 'Home' }}
      />

      {/* Favorites tab hosts the favorites stack, shows a badge when not empty */}
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{
          title: 'Favorites',
          tabBarBadge: favCount > 0 ? favCount : undefined,
          tabBarBadgeStyle: { backgroundColor: t.colors.secondary, color: '#fff' },
        }}
      />
    </Tab.Navigator>
  );
}
