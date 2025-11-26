import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface WorkoutRecord {
	id: string;
	exerciseId: string;
	title: string;
	timestamp: number;
	duration: string;
	calories: number;
}

interface HistoryState {
	items: WorkoutRecord[];
	isLoading: boolean;
}

const initialState: HistoryState = {
	items: [],
	isLoading: false,
};

export const loadHistory = createAsyncThunk('history/load', async () => {
	const json = await AsyncStorage.getItem('workout_history');
	return json ? JSON.parse(json) : [];
});

export const logWorkout = createAsyncThunk(
	'history/log',
	async (record: WorkoutRecord, { getState }) => {
		const state = getState() as any;
		const currentHistory = state.history.items;
		const newHistory = [record, ...currentHistory];
		await AsyncStorage.setItem('workout_history', JSON.stringify(newHistory));
		return record;
	}
);

export const clearHistory = createAsyncThunk('history/clear', async () => {
	await AsyncStorage.removeItem('workout_history');
	return [];
});

const historySlice = createSlice({
	name: 'history',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loadHistory.fulfilled, (state, action) => {
				state.items = action.payload;
			})
			.addCase(logWorkout.fulfilled, (state, action) => {
				state.items.unshift(action.payload);
			})
			.addCase(clearHistory.fulfilled, (state) => {
				state.items = [];
			});
	},
});

export default historySlice.reducer;
