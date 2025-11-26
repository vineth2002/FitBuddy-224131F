import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
	id: string;
	name: string;
	email: string;
	token: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	themeMode: 'light' | 'dark';
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: true,
	error: null,
	themeMode: 'light',
};

// Async Thunks
export const loginUser = createAsyncThunk(
	'auth/login',
	async (credentials: any, { rejectWithValue }) => {
		try {
			const response = await api.login(credentials);
			await AsyncStorage.setItem('user', JSON.stringify(response.data));
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.message || 'Login failed');
		}
	}
);

export const registerUser = createAsyncThunk(
	'auth/register',
	async (userData: any, { rejectWithValue }) => {
		try {
			const response = await api.register(userData);
			await AsyncStorage.setItem('user', JSON.stringify(response.data));
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.message || 'Registration failed');
		}
	}
);

export const loadUser = createAsyncThunk(
	'auth/loadUser',
	async (_, { rejectWithValue }) => {
		try {
			const userJson = await AsyncStorage.getItem('user');
			if (userJson) {
				return JSON.parse(userJson);
			}
			return null;
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
	await AsyncStorage.removeItem('user');
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		toggleTheme: (state) => {
			state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
		},
	},
	extraReducers: (builder) => {
		builder
			// Login
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			// Register
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.user = action.payload;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			// Load User
			.addCase(loadUser.fulfilled, (state, action: PayloadAction<User | null>) => {
				state.isLoading = false;
				if (action.payload) {
					state.isAuthenticated = true;
					state.user = action.payload;
				} else {
					state.isAuthenticated = false;
					state.user = null;
				}
			})
			.addCase(loadUser.rejected, (state) => {
				state.isLoading = false;
				state.isAuthenticated = false;
				state.user = null;
			})
			// Logout
			.addCase(logoutUser.fulfilled, (state) => {
				state.isAuthenticated = false;
				state.user = null;
			});
	},
});

export const { toggleTheme } = authSlice.actions;
export default authSlice.reducer;
