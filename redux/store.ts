import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth.slice';
import favoritesReducer from './favorites.slice';
import historyReducer from './history.slice';
import waterReducer from './water.slice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		favorites: favoritesReducer,
		history: historyReducer,
		water: waterReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
