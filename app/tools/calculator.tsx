import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSelector } from 'react-redux';

import { Colors } from '@/constants/theme';
import { RootState } from '@/redux/store';
import { api } from '@/services/api';

export default function CalculatorScreen() {
	const router = useRouter();
	const themeMode = useSelector((state: RootState) => state.auth.themeMode);
	const theme = Colors[themeMode];

	const [mode, setMode] = useState<'calories' | 'bmi'>('calories');


	const [activity, setActivity] = useState('');
	const [duration, setDuration] = useState('');
	const [calWeight, setCalWeight] = useState('160'); // lbs
	const [calResult, setCalResult] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);


	const [height, setHeight] = useState(''); // cm
	const [bmiWeight, setBmiWeight] = useState(''); // kg
	const [bmiResult, setBmiResult] = useState<number | null>(null);
	const [bmiCategory, setBmiCategory] = useState('');

	const handleCalculateCalories = async () => {
		if (!activity || !duration) return;

		Keyboard.dismiss();
		setLoading(true);
		try {
			const calories = await api.getCaloriesBurned(activity, parseInt(duration), parseInt(calWeight));
			setCalResult(calories);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCalculateBMI = () => {
		if (!height || !bmiWeight) return;

		Keyboard.dismiss();
		const h = parseFloat(height) / 100; // convert cm to m
		const w = parseFloat(bmiWeight);
		const bmi = w / (h * h);
		setBmiResult(parseFloat(bmi.toFixed(1)));

		if (bmi < 18.5) setBmiCategory('Underweight');
		else if (bmi < 25) setBmiCategory('Normal weight');
		else if (bmi < 30) setBmiCategory('Overweight');
		else setBmiCategory('Obese');
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
				<Stack.Screen options={{ title: 'Tools', headerBackTitle: 'Back' }} />


				<View style={[styles.toggleContainer, { backgroundColor: theme.card }]}>
					<TouchableOpacity
						style={[styles.toggleButton, mode === 'calories' && { backgroundColor: theme.tint }]}
						onPress={() => setMode('calories')}
					>
						<Text style={[styles.toggleText, mode === 'calories' ? { color: '#fff' } : { color: theme.text }]}>Calories</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.toggleButton, mode === 'bmi' && { backgroundColor: theme.tint }]}
						onPress={() => setMode('bmi')}
					>
						<Text style={[styles.toggleText, mode === 'bmi' ? { color: '#fff' } : { color: theme.text }]}>BMI</Text>
					</TouchableOpacity>
				</View>

				{mode === 'calories' ? (
					<>
						<View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
							<Text style={[styles.label, { color: theme.text }]}>Activity</Text>
							<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityScroll}>
								{['Running', 'Cycling', 'Walking', 'Swimming', 'Yoga', 'Lifting', 'HIIT'].map((item) => (
									<TouchableOpacity
										key={item}
										style={[
											styles.activityChip,
											activity === item
												? { backgroundColor: theme.tint }
												: { backgroundColor: theme.background, borderWidth: 1, borderColor: theme.icon + '40' }
										]}
										onPress={() => setActivity(item)}
									>
										<Text style={[
											styles.activityChipText,
											activity === item ? { color: '#fff' } : { color: theme.text }
										]}>{item}</Text>
									</TouchableOpacity>
								))}
							</ScrollView>

							<Text style={[styles.label, { color: theme.text }]}>Duration (minutes)</Text>
							<TextInput
								style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.icon + '40' }]}
								placeholder="e.g. 30"
								placeholderTextColor={theme.icon}
								value={duration}
								onChangeText={setDuration}
								keyboardType="numeric"
							/>

							<Text style={[styles.label, { color: theme.text }]}>Weight (lbs)</Text>
							<TextInput
								style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.icon + '40' }]}
								placeholder="e.g. 160"
								placeholderTextColor={theme.icon}
								value={calWeight}
								onChangeText={setCalWeight}
								keyboardType="numeric"
							/>

							<TouchableOpacity
								style={[styles.button, { backgroundColor: theme.tint }]}
								onPress={handleCalculateCalories}
								disabled={loading}
							>
								{loading ? (
									<ActivityIndicator color="#fff" />
								) : (
									<Text style={styles.buttonText}>Calculate Burn</Text>
								)}
							</TouchableOpacity>
						</View>

						{calResult !== null && (
							<View style={[styles.resultCard, { backgroundColor: theme.secondary }]}>
								<Text style={styles.resultLabel}>Estimated Burn</Text>
								<Text style={styles.resultValue}>{calResult} kcal</Text>
								<Text style={styles.resultSub}>
									for {duration} min of {activity}
								</Text>
							</View>
						)}
					</>
				) : (
					<>
						<View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
							<Text style={[styles.label, { color: theme.text }]}>Height (cm)</Text>
							<TextInput
								style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.icon + '40' }]}
								placeholder="e.g. 175"
								placeholderTextColor={theme.icon}
								value={height}
								onChangeText={setHeight}
								keyboardType="numeric"
							/>

							<Text style={[styles.label, { color: theme.text }]}>Weight (kg)</Text>
							<TextInput
								style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.icon + '40' }]}
								placeholder="e.g. 70"
								placeholderTextColor={theme.icon}
								value={bmiWeight}
								onChangeText={setBmiWeight}
								keyboardType="numeric"
							/>

							<TouchableOpacity
								style={[styles.button, { backgroundColor: theme.tint }]}
								onPress={handleCalculateBMI}
							>
								<Text style={styles.buttonText}>Calculate BMI</Text>
							</TouchableOpacity>
						</View>

						{bmiResult !== null && (
							<View style={[styles.resultCard, { backgroundColor: theme.secondary }]}>
								<Text style={styles.resultLabel}>Your BMI</Text>
								<Text style={styles.resultValue}>{bmiResult}</Text>
								<Text style={styles.resultSub}>{bmiCategory}</Text>
							</View>
						)}
					</>
				)}
			</ScrollView>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	toggleContainer: {
		flexDirection: 'row',
		borderRadius: 15,
		padding: 4,
		marginBottom: 20,
	},
	toggleButton: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 12,
		alignItems: 'center',
	},
	toggleText: {
		fontWeight: '600',
		fontSize: 16,
	},
	card: {
		padding: 20,
		borderRadius: 20,
		elevation: 2,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 8,
		marginLeft: 4,
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 15,
		fontSize: 16,
		marginBottom: 20,
	},
	activityScroll: {
		marginBottom: 20,
		maxHeight: 50,
	},
	activityChip: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 20,
		marginRight: 10,
		height: 40,
		justifyContent: 'center',
	},
	activityChipText: {
		fontWeight: '600',
		fontSize: 14,
	},
	button: {
		height: 56,
		borderRadius: 16,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
	resultCard: {
		padding: 30,
		borderRadius: 25,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 40,
	},
	resultLabel: {
		color: 'rgba(255,255,255,0.9)',
		fontSize: 18,
		fontWeight: '600',
		marginBottom: 10,
	},
	resultValue: {
		color: '#fff',
		fontSize: 48,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	resultSub: {
		color: 'rgba(255,255,255,0.8)',
		fontSize: 20,
		fontWeight: '500',
	},
});
