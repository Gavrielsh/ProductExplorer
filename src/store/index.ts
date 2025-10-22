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
 * Persist config for the products slice.
 * We only persist the 'favorites' field to keep storage small
 * and avoid caching remote data ('items') across sessions.
 */
const productsPersistConfig = {
  key: 'products',
  storage: AsyncStorage,
  whitelist: ['favorites'], // persist only favorites
};

/**
 * Root reducer
 * - Wrap only the products slice with persistence.
 */
const rootReducer = combineReducers({
  products: persistReducer(productsPersistConfig, productsReducer),
});

/**
 * Store configuration
 * - Adds redux-persist compatible serializableCheck ignores.
 * - Uses RTK default middleware (thunk + immutability/serializable checks).
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist internal non-serializable action payloads
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/**
 * Persistor
 * - Used by <PersistGate> to delay UI until rehydration finishes.
 */
export const persistor = persistStore(store);

/**
 * Typed helpers
 * - RootState for selectors
 * - AppDispatch for typed dispatch (incl. thunks)
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
