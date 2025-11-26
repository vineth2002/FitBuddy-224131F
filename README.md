# FitBuddy 🏋️‍♂️

FitBuddy is a comprehensive React Native fitness application designed to help users track their workouts, calculate fitness metrics, and stay motivated. Built with **Expo** and **Redux Toolkit**, it features a modern, responsive UI with dark mode support.

## 📱 Features

### 🔐 Authentication
- **User Registration & Login**: Create an account and log in securely.
- **Local Persistence**: User data is saved locally using `AsyncStorage`, allowing you to log out and log back in with the same credentials.
- **Profile Management**: View your stats and workout history.

### 🏋️‍♀️ Exercise Library
- **Dynamic Data**: Fetches exercise data from the **Wger API** (Open Source).
- **Search & Filter**: Easily find workouts by name or category (Cardio, Strength, Flexibility, HIIT).
- **Details View**: View comprehensive details including instructions and muscle groups.
- **Favorites**: Save your go-to exercises for quick access.

### 🧮 Fitness Tools
- **BMI Calculator**: Calculate your Body Mass Index and see your weight category.
- **Calories Burned Calculator**: Estimate calories burned based on activity type, duration, and weight.

### 🎨 UI/UX
- **Dark Mode**: Toggle between light and dark themes.
- **Responsive Design**: Optimized for various screen sizes.
- **Smooth Animations**: Uses `react-native-reanimated` for a polished feel.

## 🛠 Tech Stack

- **Framework**: React Native (Expo SDK 50+)
- **Routing**: Expo Router (File-based routing)
- **State Management**: Redux Toolkit
- **Styling**: StyleSheet, Expo Vector Icons
- **API**: Axios (Wger API)
- **Storage**: AsyncStorage
- **Validation**: React Hook Form + Yup

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd FitBuddy
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the app**
    ```bash
    npx expo start -c
    ```
    *Note: The `-c` flag clears the cache to ensure a clean start.*

4.  **Run on Device/Emulator**
    - Scan the QR code with **Expo Go** (Android/iOS).
    - Press `a` for Android Emulator.
    - Press `i` for iOS Simulator.

## 📝 API Note

This project uses the **Wger API** for exercise data. It is a free, open-source API that does not require an API key for basic usage, making it ideal for this demonstration.

## 📂 Project Structure

- **`app/`**: Screens and navigation (Expo Router).
- **`components/`**: Reusable UI components.
- **`redux/`**: State management slices and store configuration.
- **`services/`**: API integration and authentication logic.
- **`constants/`**: Theme colors and configuration.


