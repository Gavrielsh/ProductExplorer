import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { useAppSelector } from '../hooks';
import { useTheme } from '../theme/ThemeProvider';

export type RootStackParamList = {
  Home: undefined;
  ProductDetails: { id: number };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeStack() {
  const t = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'fade',
        headerStyle: { backgroundColor: t.colors.bg },
        headerTintColor: t.colors.text,
        contentStyle: { backgroundColor: t.colors.bg },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  const t = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'fade',
        headerStyle: { backgroundColor: t.colors.bg },
        headerTintColor: t.colors.text,
        contentStyle: { backgroundColor: t.colors.bg },
      }}
    >
      <Stack.Screen
        name="Home"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const t = useTheme();
  const favorites = useAppSelector((s) => s.products.favorites);
  const badge = favorites.length ? String(favorites.length) : undefined;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: t.colors.card },
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          const name = route.name === 'HomeTab' ? 'home-outline' : 'heart-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="FavoritesTab" component={FavoritesStack} options={{ title: 'Favorites', tabBarBadge: badge }} />
    </Tab.Navigator>
  );
}
