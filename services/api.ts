import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://wger.de/api/v2';
// NOTE: We are using Wger API (Open Source) instead of API Ninjas because API Ninjas requires an API Key.
// Wger provides similar functionality for this demo without configuration overhead.

const USERS_KEY = 'fitbuddy_users';

const FALLBACK_EXERCISES = [
	{
		id: '1',
		title: 'Push Up',
		image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
		description: 'A classic upper body exercise that targets the chest, shoulders, and triceps.',
		category: 'Strength',
		duration: '10 min',
	},
	{
		id: '2',
		title: 'Squat',
		image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
		description: 'A fundamental lower body exercise that works the quadriceps, hamstrings, and glutes.',
		category: 'Strength',
		duration: '15 min',
	},
	{
		id: '3',
		title: 'Running',
		image: 'https://images.unsplash.com/photo-1552674605-4696c0465d6d?w=800',
		description: 'A great cardiovascular exercise to improve heart health and burn calories.',
		category: 'Cardio',
		duration: '30 min',
	},
	{
		id: '4',
		title: 'Plank',
		image: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=800',
		description: 'An isometric core strength exercise that involves maintaining a position similar to a push-up.',
		category: 'Strength',
		duration: '5 min',
	},
	{
		id: '5',
		title: 'Yoga Flow',
		image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800',
		description: 'A series of yoga poses to improve flexibility, balance, and mental focus.',
		category: 'Flexibility',
		duration: '20 min',
	},
];

export const api = {
	login: async (credentials: any) => {
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 800));

		const usersJson = await AsyncStorage.getItem(USERS_KEY);
		const users = usersJson ? JSON.parse(usersJson) : [];

		const user = users.find((u: any) => u.email === credentials.email && u.password === credentials.password);

		if (user) {
			return {
				data: {
					id: user.id,
					name: user.name,
					email: user.email,
					token: 'mock-jwt-token-' + user.id,
				},
			};
		} else {
			throw new Error('Invalid email or password');
		}
	},

	register: async (userData: any) => {
		// Simulate network delay
		await new Promise(resolve => setTimeout(resolve, 800));

		const usersJson = await AsyncStorage.getItem(USERS_KEY);
		const users = usersJson ? JSON.parse(usersJson) : [];

		if (users.find((u: any) => u.email === userData.email)) {
			throw new Error('Email already exists');
		}

		const newUser = {
			id: Date.now().toString(),
			name: userData.name,
			email: userData.email,
			password: userData.password,
		};

		users.push(newUser);
		await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

		return {
			data: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				token: 'mock-jwt-token-' + newUser.id,
			},
		};
	},

	getExercises: async () => {
		try {
			// Fetch from Wger API

			const response = await axios.get(`${API_URL}/exercise/?language=2&limit=20`);

			// Transform Wger data to our app's format
			const wgerExercises = response.data.results.map((item: any, index: number) => ({
				id: item.id.toString(),
				title: item.name,

				image: FALLBACK_EXERCISES[index % FALLBACK_EXERCISES.length].image,

				description: (item.description && item.description.trim().length > 0)
					? item.description.replace(/<[^>]*>/g, '').slice(0, 100) + '...'
					: 'A great exercise to improve your fitness. Tap to see more details.',
				category: 'Strength',
				duration: '15 min',
			}));

			return { data: wgerExercises.length > 0 ? wgerExercises : FALLBACK_EXERCISES };
		} catch (error) {
			console.warn('API fetch failed, using fallback data', error);
			return { data: FALLBACK_EXERCISES };
		}
	},

	getExerciseById: async (id: string) => {

		const fallbackItem = FALLBACK_EXERCISES.find(e => e.id === id);
		if (fallbackItem) {
			return { data: fallbackItem };
		}

		try {
			const response = await axios.get(`${API_URL}/exercise/${id}/`);
			const item = response.data;
			return {
				data: {
					id: item.id.toString(),
					title: item.name,
					image: FALLBACK_EXERCISES[0].image, // Placeholder
					description: item.description ? item.description.replace(/<[^>]*>/g, '') : 'No description available.',
					category: 'Strength',
					duration: '15 min',
				}
			};
		} catch (error) {
			return { data: FALLBACK_EXERCISES[0] };
		}
	},

	getCaloriesBurned: async (activity: string, duration: number, weight: number = 160) => {

		const mets: { [key: string]: number } = {
			running: 9.8,
			cycling: 7.5,
			walking: 3.8,
			swimming: 8.0,
			yoga: 2.5,
			lifting: 4.0,
			hiit: 11.0,
		};

		const activityLower = activity.toLowerCase();
		let met = 5.0; // Default moderate intensity

		for (const key in mets) {
			if (activityLower.includes(key)) {
				met = mets[key];
				break;
			}
		}

		// Formula: Calories = MET * weight(kg) * duration(hours)
		const weightKg = weight * 0.453592;
		const durationHours = duration / 60;
		const calories = Math.round(met * weightKg * durationHours);


		return new Promise<number>((resolve) => {
			setTimeout(() => resolve(calories), 800);
		});
	},
};
