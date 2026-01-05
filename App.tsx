import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import './global.css';

// Contexts
import { AuthProvider } from './src/context/AuthContext';
import { FoodCartProvider } from './src/context/FoodCartContext';

// Navigation
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <FoodCartProvider>
                    <NavigationContainer>
                        <RootNavigator />
                        <StatusBar style="light" />
                    </NavigationContainer>
                </FoodCartProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
