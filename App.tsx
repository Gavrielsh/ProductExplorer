// App.tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar, View, StyleSheet } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';

// Theme provider/hooks
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';

/**
 * Inner app that consumes theme from ThemeProvider.
 * Split to allow hooks usage after providers are mounted.
 */
function AppShell() {
  const t = useTheme();

  // Compose a React Navigation theme that reflects our tokens
  const navTheme = t.isDark ? DarkTheme : DefaultTheme;
  navTheme.colors.background = t.colors.bg;
  navTheme.colors.text = t.colors.text;
  navTheme.dark = t.isDark;

  return (
    <View style={[styles.root, { backgroundColor: t.colors.bg }]}>
      <StatusBar barStyle={t.isDark ? 'light-content' : 'dark-content'} backgroundColor={t.colors.bg} />
      {
        // Using createElement to avoid occasional JSX typing issues with PersistGate
        React.createElement(
          PersistGate as unknown as React.ComponentType<any>,
          { persistor, loading: null },
          <NavigationContainer theme={navTheme}>
            <AppNavigator />
          </NavigationContainer>
        )
      }
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
