import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { RootState } from '@/redux/store';

const TIPS = [
	{ icon: 'water', title: 'Stay Hydrated', text: 'Drink at least 8 glasses of water a day to keep your energy up.' },
	{ icon: 'bed', title: 'Sleep Well', text: 'Aim for 7-9 hours of sleep to help your muscles recover.' },
	{ icon: 'nutrition', title: 'Eat Protein', text: 'Protein is essential for muscle repair and growth after workouts.' },
	{ icon: 'walk', title: 'Keep Moving', text: 'Take short walks during breaks to improve circulation.' },
	{ icon: 'sunny', title: 'Get Sunlight', text: 'Morning sunlight helps regulate your sleep-wake cycle.' },
];

export default function WellnessTips() {
	const [tip, setTip] = useState(TIPS[0]);
	const themeMode = useSelector((state: RootState) => state.auth.themeMode);
	const theme = Colors[themeMode];

	useEffect(() => {

		const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
		setTip(randomTip);
	}, []);

	return (
		<View style={[styles.container, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
			<View style={styles.header}>
				<View style={[styles.iconBox, { backgroundColor: theme.tint + '20' }]}>
					{/* @ts-ignore */}
					<Ionicons name={tip.icon} size={20} color={theme.tint} />
				</View>
				<Text style={[styles.title, { color: theme.text }]}>Daily Tip: {tip.title}</Text>
			</View>
			<Text style={[styles.text, { color: theme.icon }]}>{tip.text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 15,
		borderRadius: 20,
		marginBottom: 20,
		elevation: 2,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	iconBox: {
		width: 32,
		height: 32,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	text: {
		fontSize: 14,
		lineHeight: 20,
	},
});
