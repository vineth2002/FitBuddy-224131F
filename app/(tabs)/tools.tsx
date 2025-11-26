import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { RootState } from '@/redux/store';

export default function ToolsScreen() {
	const router = useRouter();
	const themeMode = useSelector((state: RootState) => state.auth.themeMode);
	const theme = Colors[themeMode];

	const tools = [
		{
			id: 'calories',
			title: 'Calories Calculator',
			description: 'Estimate calories burned for various activities.',
			icon: 'flame',
			route: '/tools/calculator',
			color: '#FF6B6B',
		},
		// Future tools can be added here
		{
			id: 'bmi',
			title: 'BMI Calculator',
			description: 'Calculate your Body Mass Index.',
			icon: 'calculator',
			route: '/tools/calculator', // Placeholder
			color: '#4ECDC4',
		},
	];

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
			<View style={styles.header}>
				<Text style={[styles.headerTitle, { color: theme.text }]}>Fitness Tools</Text>
				<Text style={[styles.headerSubtitle, { color: theme.icon }]}>Utilities to track your progress</Text>
			</View>

			<View style={styles.grid}>
				{tools.map((tool) => (
					<TouchableOpacity
						key={tool.id}
						style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
						onPress={() => router.push(tool.route as any)}
					>
						<LinearGradient
							colors={[tool.color, tool.color + '80']}
							style={styles.iconContainer}
						>
							<Ionicons name={tool.icon as any} size={32} color="#fff" />
						</LinearGradient>
						<View style={styles.cardContent}>
							<Text style={[styles.cardTitle, { color: theme.text }]}>{tool.title}</Text>
							<Text style={[styles.cardDescription, { color: theme.icon }]}>{tool.description}</Text>
						</View>
						<Ionicons name="chevron-forward" size={24} color={theme.icon} />
					</TouchableOpacity>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingTop: 60,
	},
	header: {
		marginBottom: 30,
	},
	headerTitle: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	headerSubtitle: {
		fontSize: 16,
	},
	grid: {
		gap: 15,
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 15,
		borderRadius: 20,
		elevation: 2,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	iconContainer: {
		width: 60,
		height: 60,
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 15,
	},
	cardContent: {
		flex: 1,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	cardDescription: {
		fontSize: 14,
		lineHeight: 20,
	},
});
