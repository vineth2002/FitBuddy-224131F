import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Exercise {
	id: string;
	title: string;
	image: string;
	description: string;
	category: string;
	duration: string;
}

interface FavoritesState {
	items: Exercise[];
}

const initialState: FavoritesState = {
	items: [],
};

const favoritesSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {
		toggleFavorite: (state, action: PayloadAction<Exercise>) => {
			const index = state.items.findIndex((item) => item.id === action.payload.id);
			if (index >= 0) {
				state.items.splice(index, 1);
			} else {
				state.items.push(action.payload);
			}
			// Persist to AsyncStorage
			AsyncStorage.setItem('favorites', JSON.stringify(state.items));
		},
		setFavorites: (state, action: PayloadAction<Exercise[]>) => {
			state.items = action.payload;
		},
	},
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
