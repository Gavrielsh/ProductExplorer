// App.tsx
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { useColorScheme, StatusBar, View, StyleSheet } from 'react-native';
import { makeTheme } from './src/theme/theme';

export default function App() {
  const scheme = useColorScheme();
  const t = makeTheme(scheme);

  // תיאום צבעי נווט עם התֵמה
  const navTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
  navTheme.colors.background = t.colors.bg;
  navTheme.colors.card = t.colors.card;
  navTheme.colors.text = t.colors.text;
  navTheme.colors.border = t.colors.border;
  navTheme.colors.primary = t.colors.primary;

  return (
    <Provider store={store}>
      <View style={[styles.root, { backgroundColor: t.colors.bg }]}>
        <StatusBar
          barStyle={t.isDark ? 'light-content' : 'dark-content'}
          backgroundColor={t.colors.bg}
        />
        <NavigationContainer theme={navTheme}>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
