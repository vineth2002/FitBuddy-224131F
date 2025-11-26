import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { logoutUser, toggleTheme } from '@/redux/auth.slice';
import { loadHistory } from '@/redux/history.slice';
import { RootState } from '@/redux/store';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { user, themeMode } = useSelector((state: RootState) => state.auth);
	const history = useSelector((state: RootState) => state.history.items);
	const theme = Colors[themeMode];

	useEffect(() => {
		// @ts-ignore
		dispatch(loadHistory());
	}, []);

	const handleLogout = async () => {
		// @ts-ignore
		await dispatch(logoutUser());
		router.replace('/login');
	};

	const totalWorkouts = history.length;
	const totalCalories = history.reduce((sum, item) => sum + (item.calories || 0), 0);
	const totalDuration = history.reduce((sum, item) => {
		const duration = parseInt(item.duration) || 0;
		return sum + duration;
	}, 0);

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
			<View style={styles.header}>
				<LinearGradient
					colors={[theme.tint, theme.secondary]}
					style={styles.headerGradient}
				/>
				<View style={styles.profileContent}>
					<View style={[styles.avatarContainer, { borderColor: theme.background }]}>
						<LinearGradient
							colors={[theme.tint, theme.secondary]}
							style={styles.avatarGradient}
						>
							<Text style={styles.avatarText}>
								{user?.name?.charAt(0).toUpperCase() || 'U'}
							</Text>
						</LinearGradient>
					</View>
					<Text style={[styles.name, { color: theme.text }]}>{user?.name || 'User Name'}</Text>
					<Text style={[styles.email, { color: theme.icon }]}>{user?.email || 'user@example.com'}</Text>
				</View>
			</View>

			<View style={styles.statsContainer}>
				<View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
					<Ionicons name="barbell" size={24} color={theme.tint} style={{ marginBottom: 5 }} />
					<Text style={[styles.statValue, { color: theme.text }]}>{totalWorkouts}</Text>
					<Text style={[styles.statLabel, { color: theme.icon }]}>Workouts</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
					<Ionicons name="time" size={24} color={theme.secondary} style={{ marginBottom: 5 }} />
					<Text style={[styles.statValue, { color: theme.text }]}>{totalDuration}m</Text>
					<Text style={[styles.statLabel, { color: theme.icon }]}>Time</Text>
				</View>
				<View style={[styles.statCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
					<Ionicons name="flame" size={24} color="#FF9F43" style={{ marginBottom: 5 }} />
					<Text style={[styles.statValue, { color: theme.text }]}>{totalCalories}</Text>
					<Text style={[styles.statLabel, { color: theme.icon }]}>Calories</Text>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
				{history.slice(0, 3).map((item, index) => (
					<View key={index} style={[styles.row, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
						<View style={styles.rowLeft}>
							<View style={[styles.iconBox, { backgroundColor: theme.tint + '20' }]}>
								<Ionicons name="fitness" size={20} color={theme.tint} />
							</View>
							<View>
								<Text style={[styles.rowLabel, { color: theme.text }]}>{item.title}</Text>
								<Text style={[styles.rowSubLabel, { color: theme.icon, marginLeft: 15, fontSize: 12 }]}>
									{new Date(item.timestamp).toLocaleDateString()} • {item.calories} cal
								</Text>
							</View>
						</View>
						<Text style={[styles.historyDuration, { color: theme.text }]}>{item.duration}</Text>
					</View>
				))}
				{history.length === 0 && (
					<Text style={{ color: theme.icon, marginLeft: 5, marginBottom: 10 }}>No workouts yet. Go sweat!</Text>
				)}
			</View>

			<View style={styles.section}>
				<Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>

				<TouchableOpacity
					style={[styles.row, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
					onPress={() => dispatch(toggleTheme())}
				>
					<View style={styles.rowLeft}>
						<View style={[styles.iconBox, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
							<Ionicons name={themeMode === 'light' ? 'moon' : 'sunny'} size={20} color={theme.text} />
						</View>
						<Text style={[styles.rowLabel, { color: theme.text }]}>Dark Mode</Text>
					</View>
					<Ionicons name={themeMode === 'dark' ? 'toggle' : 'toggle-outline'} size={28} color={theme.tint} />
				</TouchableOpacity>

				<TouchableOpacity style={[styles.row, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
					<View style={styles.rowLeft}>
						<View style={[styles.iconBox, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
							<Ionicons name="notifications" size={20} color={theme.text} />
						</View>
						<Text style={[styles.rowLabel, { color: theme.text }]}>Notifications</Text>
					</View>
					<Ionicons name="chevron-forward" size={24} color={theme.icon} />
				</TouchableOpacity>
			</View>

			<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
				<Text style={styles.logoutText}>Log Out</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		marginBottom: 20,
		alignItems: 'center',
	},
	headerGradient: {
		width: '100%',
		height: 150,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	profileContent: {
		marginTop: -60,
		alignItems: 'center',
	},
	avatarContainer: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 4,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15,
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
	},
	avatarGradient: {
		width: '100%',
		height: '100%',
		borderRadius: 60,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarText: {
		fontSize: 48,
		fontWeight: 'bold',
		color: '#fff',
	},
	name: {
		fontSize: 26,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	email: {
		fontSize: 16,
	},
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		marginBottom: 30,
	},
	statCard: {
		flex: 1,
		alignItems: 'center',
		padding: 15,
		borderRadius: 20,
		marginHorizontal: 6,
		elevation: 2,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	statValue: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 2,
	},
	statLabel: {
		fontSize: 12,
		fontWeight: '500',
	},
	section: {
		paddingHorizontal: 20,
		marginBottom: 30,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
		marginLeft: 5,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 15,
		borderRadius: 15,
		marginBottom: 10,
		elevation: 1,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.05,
		shadowRadius: 2,
	},
	rowLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	iconBox: {
		width: 36,
		height: 36,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	rowLabel: {
		fontSize: 16,
		marginLeft: 15,
		fontWeight: '500',
	},
	rowSubLabel: {
		marginTop: 2,
	},
	historyDuration: {
		fontSize: 14,
		fontWeight: '600',
	},
	logoutButton: {
		marginHorizontal: 20,
		backgroundColor: '#FF4444',
		padding: 18,
		borderRadius: 20,
		alignItems: 'center',
		marginBottom: 40,
		elevation: 2,
		shadowColor: '#FF4444',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
	},
	logoutText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
		letterSpacing: 0.5,
	},
});
