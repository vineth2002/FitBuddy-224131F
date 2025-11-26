import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { registerUser } from '@/redux/auth.slice';
import { RootState } from '@/redux/store';

const schema = yup.object({
	name: yup.string().required('Name is required'),
	email: yup.string().email('Invalid email').required('Email is required'),
	password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
	confirmPassword: yup.string()
		.oneOf([yup.ref('password')], 'Passwords must match')
		.required('Confirm Password is required'),
}).required();

export default function RegisterScreen() {
	const dispatch = useDispatch();
	const router = useRouter();
	const { isLoading, error } = useSelector((state: RootState) => state.auth);
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? 'light'];

	const { control, handleSubmit, formState: { errors } } = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data: any) => {
		try {
			const resultAction = await dispatch(registerUser({ name: data.name, email: data.email, password: data.password }) as any);
			if (registerUser.fulfilled.match(resultAction)) {
				// Navigation handled in _layout.tsx
			} else {
				if (resultAction.payload) {
					Alert.alert('Registration Failed', resultAction.payload as string);
				} else {
					Alert.alert('Registration Failed', 'An unknown error occurred');
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<View style={styles.content}>
				<Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
				<Text style={[styles.subtitle, { color: theme.text }]}>Join FitBuddy today!</Text>

				<Controller
					control={control}
					name="name"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
							placeholder="Full Name"
							placeholderTextColor="#999"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
						/>
					)}
				/>
				{errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

				<Controller
					control={control}
					name="email"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
							placeholder="Email"
							placeholderTextColor="#999"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							autoCapitalize="none"
							keyboardType="email-address"
						/>
					)}
				/>
				{errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

				<Controller
					control={control}
					name="password"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
							placeholder="Password"
							placeholderTextColor="#999"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							secureTextEntry
						/>
					)}
				/>
				{errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

				<Controller
					control={control}
					name="confirmPassword"
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
							placeholder="Confirm Password"
							placeholderTextColor="#999"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							secureTextEntry
						/>
					)}
				/>
				{errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

				<TouchableOpacity
					style={[styles.button, { backgroundColor: theme.tint }]}
					onPress={handleSubmit(onSubmit)}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={styles.buttonText}>Sign Up</Text>
					)}
				</TouchableOpacity>

				<View style={styles.footer}>
					<Text style={{ color: theme.text }}>Already have an account? </Text>
					<Link href="/login" asChild>
						<TouchableOpacity>
							<Text style={[styles.link, { color: theme.tint }]}>Login</Text>
						</TouchableOpacity>
					</Link>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
	},
	content: {
		width: '100%',
		maxWidth: 400,
		alignSelf: 'center',
	},
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 10,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: 18,
		marginBottom: 30,
		textAlign: 'center',
		opacity: 0.8,
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 15,
		marginBottom: 10,
		fontSize: 16,
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
		marginLeft: 5,
	},
	button: {
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
	},
	link: {
		fontWeight: 'bold',
	},
});
