import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { toggleFavorite } from '@/redux/favorites.slice';
import { logWorkout } from '@/redux/history.slice';
import { RootState } from '@/redux/store';
import { api } from '@/services/api';

const { width } = Dimensions.get('window');

export default function DetailsScreen() {
	const { id } = useLocalSearchParams();
	const [item, setItem] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const themeMode = useSelector((state: RootState) => state.auth.themeMode);
	const theme = Colors[themeMode];
	const router = useRouter();

	const dispatch = useDispatch();
	const favorites = useSelector((state: RootState) => state.favorites.items);
	const isFavorite = favorites.some((fav) => fav.id === item?.id);

	useEffect(() => {
		if (id) {
			loadDetails(id as string);
		}
	}, [id]);

	const loadDetails = async (itemId: string) => {
		try {
			const response = await api.getExerciseById(itemId);
			setItem(response.data);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleToggleFavorite = () => {
		if (item) {
			dispatch(toggleFavorite(item));
		}
	};

	const handleCompleteWorkout = () => {
		if (item) {
			const record = {
				id: Date.now().toString(),
				exerciseId: item.id,
				title: item.title,
				timestamp: Date.now(),
				duration: item.duration,
				calories: 350, // Mock value for now
			};
			// @ts-ignore
			dispatch(logWorkout(record));
			Alert.alert('Great Job!', 'Workout completed and saved to history.');
			router.back();
		}
	};

	if (loading) {
		return (
			<View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
				<ActivityIndicator size="large" color={theme.tint} />
			</View>
		);
	}

	if (!item) {
		return (
			<View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
				<Text style={{ color: theme.text }}>Item not found</Text>
			</View>
		);
	}

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: '',
					headerTransparent: true,
					headerTintColor: '#fff',
					headerLeft: () => (
						<TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
							<Ionicons name="arrow-back" size={24} color="#fff" />
						</TouchableOpacity>
					),
				}}
			/>
			<ScrollView style={[styles.container, { backgroundColor: theme.background }]} bounces={false}>
				<View style={styles.imageContainer}>
					<Image source={{ uri: item.image }} style={styles.image} />
					<LinearGradient
						colors={['transparent', theme.background]}
						style={styles.gradientOverlay}
					/>
				</View>

				<View style={[styles.content]}>
					<View style={styles.header}>
						<View style={{ flex: 1 }}>
							<View style={[styles.categoryBadge, { backgroundColor: theme.tint }]}>
								<Text style={styles.categoryText}>{item.category}</Text>
							</View>
							<Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
						</View>
						<TouchableOpacity
							onPress={handleToggleFavorite}
							style={[styles.favButton, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
						>
							<Ionicons
								name={isFavorite ? "heart" : "heart-outline"}
								size={28}
								color={isFavorite ? "#FF4444" : theme.icon}
							/>
						</TouchableOpacity>
					</View>

					<View style={styles.metaContainer}>
						<View style={[styles.metaItem, { backgroundColor: theme.card }]}>
							<Ionicons name="time-outline" size={20} color={theme.tint} />
							<Text style={[styles.metaText, { color: theme.text }]}>{item.duration}</Text>
						</View>
						<View style={[styles.metaItem, { backgroundColor: theme.card }]}>
							<Ionicons name="flame-outline" size={20} color={theme.tint} />
							<Text style={[styles.metaText, { color: theme.text }]}>350 cal</Text>
						</View>
					</View>

					<Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
					<Text style={[styles.description, { color: theme.text }]}>{item.description}</Text>

					<TouchableOpacity
						style={[styles.startButton, { backgroundColor: theme.tint }]}
						onPress={handleCompleteWorkout}
					>
						<Text style={styles.startButtonText}>Complete Workout</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	backButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: 'rgba(0,0,0,0.3)',
		marginLeft: 10,
	},
	imageContainer: {
		height: 400,
		width: '100%',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	gradientOverlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		height: 150,
	},
	content: {
		flex: 1,
		marginTop: -40,
		padding: 25,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 25,
	},
	categoryBadge: {
		alignSelf: 'flex-start',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		marginBottom: 10,
	},
	categoryText: {
		color: '#fff',
		fontSize: 12,
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		lineHeight: 38,
	},
	favButton: {
		padding: 12,
		borderRadius: 50,
		elevation: 5,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
	},
	metaContainer: {
		flexDirection: 'row',
		marginBottom: 30,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 15,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 15,
	},
	metaText: {
		marginLeft: 8,
		fontWeight: '600',
		fontSize: 14,
	},
	sectionTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 12,
	},
	description: {
		fontSize: 16,
		lineHeight: 26,
		opacity: 0.8,
		marginBottom: 40,
	},
	startButton: {
		paddingVertical: 18,
		borderRadius: 20,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 8,
	},
	startButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
		letterSpacing: 1,
	},
});
