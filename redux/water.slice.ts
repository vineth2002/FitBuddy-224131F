import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WaterState {
	currentIntake: number;
	dailyGoal: number;
	isLoading: boolean;
}

const initialState: WaterState = {
	currentIntake: 0,
	dailyGoal: 2500, // Default 2.5L
	isLoading: false,
};

export const loadWaterData = createAsyncThunk('water/load', async () => {
	const today = new Date().toISOString().split('T')[0];
	const json = await AsyncStorage.getItem(`water_${today}`);
	return json ? JSON.parse(json) : 0;
});

export const addWater = createAsyncThunk(
	'water/add',
	async (amount: number, { getState }) => {
		const state = getState() as any;
		const newAmount = state.water.currentIntake + amount;
		const today = new Date().toISOString().split('T')[0];
		await AsyncStorage.setItem(`water_${today}`, JSON.stringify(newAmount));
		return newAmount;
	}
);

export const resetWater = createAsyncThunk('water/reset', async () => {
	const today = new Date().toISOString().split('T')[0];
	await AsyncStorage.setItem(`water_${today}`, JSON.stringify(0));
	return 0;
});

const waterSlice = createSlice({
	name: 'water',
	initialState,
	reducers: {
		setGoal: (state, action: PayloadAction<number>) => {
			state.dailyGoal = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loadWaterData.fulfilled, (state, action) => {
				state.currentIntake = action.payload;
			})
			.addCase(addWater.fulfilled, (state, action) => {
				state.currentIntake = action.payload;
			})
			.addCase(resetWater.fulfilled, (state) => {
				state.currentIntake = 0;
			});
	},
});

export const { setGoal } = waterSlice.actions;
export default waterSlice.reducer;
