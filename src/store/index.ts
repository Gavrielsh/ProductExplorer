import { configureStore, combineReducers } from '@reduxjs/toolkit';
import productsReducer from '../slices/productsSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

/**
 * Root reducer
 * We persist the products slice with a whitelist so only relevant keys are saved.
 * This gives "offline caching" for items and favorites without bloating storage.
 */
const rootReducer = combineReducers({
  products: persistReducer(
    {
      key: 'products',
      storage: AsyncStorage,
      // Persist both product list (items) and favorites for offline UX
      whitelist: ['items', 'favorites'],
      // Version bump for future migrations if shape changes
      version: 1,
    },
    productsReducer
  ),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/**
 * Persistor
 * Used by <PersistGate> to delay UI until rehydration finishes.
 */
export const persistor = persistStore(store);

/**
 * Typed helpers
 * - RootState for selectors
 * - AppDispatch for typed dispatch (incl. thunks)
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
