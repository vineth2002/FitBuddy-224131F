import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { RootState } from '@/redux/store';
import { addWater, loadWaterData, resetWater } from '@/redux/water.slice';

export default function WaterTracker() {
	const dispatch = useDispatch();
	const { currentIntake, dailyGoal } = useSelector((state: RootState) => state.water);
	const themeMode = useSelector((state: RootState) => state.auth.themeMode);
	const theme = Colors[themeMode];

	useEffect(() => {
		// @ts-ignore
		dispatch(loadWaterData());
	}, []);

	const handleAddWater = (amount: number) => {
		// @ts-ignore
		dispatch(addWater(amount));
	};

	const progress = Math.min(currentIntake / dailyGoal, 1);

	return (
		<View style={[styles.container, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
			<View style={styles.header}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Ionicons name="water" size={24} color="#4ECDC4" />
					<Text style={[styles.title, { color: theme.text }]}>Hydration</Text>
				</View>
				<Text style={[styles.goalText, { color: theme.icon }]}>{currentIntake} / {dailyGoal} ml</Text>
			</View>

			<View style={[styles.progressBarBg, { backgroundColor: theme.background }]}>
				<View
					style={[
						styles.progressBarFill,
						{
							width: `${progress * 100}%`,
							backgroundColor: '#4ECDC4'
						}
					]}
				/>
			</View>

			<View style={styles.controls}>
				<TouchableOpacity
					style={[styles.addButton, { borderColor: '#4ECDC4' }]}
					onPress={() => handleAddWater(250)}
				>
					<Ionicons name="add" size={16} color="#4ECDC4" />
					<Text style={[styles.addText, { color: theme.text }]}>250ml</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.addButton, { borderColor: '#4ECDC4' }]}
					onPress={() => handleAddWater(500)}
				>
					<Ionicons name="add" size={16} color="#4ECDC4" />
					<Text style={[styles.addText, { color: theme.text }]}>500ml</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.resetButton}
					onPress={() => {
						// @ts-ignore
						dispatch(resetWater());
					}}
				>
					<Ionicons name="refresh" size={20} color={theme.icon} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		borderRadius: 20,
		marginBottom: 20,
		elevation: 2,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 10,
	},
	goalText: {
		fontSize: 14,
		fontWeight: '500',
	},
	progressBarBg: {
		height: 12,
		borderRadius: 6,
		marginBottom: 20,
		overflow: 'hidden',
	},
	progressBarFill: {
		height: '100%',
		borderRadius: 6,
	},
	controls: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 20,
		borderWidth: 1,
	},
	addText: {
		marginLeft: 5,
		fontWeight: '600',
		fontSize: 12,
	},
	resetButton: {
		padding: 8,
	},
});
