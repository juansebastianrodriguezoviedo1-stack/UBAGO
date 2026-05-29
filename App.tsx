import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import './global.css';

// Contexts
import { AuthProvider } from './src/context/AuthContext';
import { FoodCartProvider } from './src/context/FoodCartContext';
import { LocationProvider } from './src/context/LocationContext';
import { RideProvider } from './src/context/RideContext';

// Navigation
import RootNavigator from './src/navigation/RootNavigator';

import * as Linking from 'expo-linking';

// Deep Linking Configuration
const linking = {
    prefixes: [Linking.createURL('/'), 'ubagoapp://', 'ubago://'],
    config: {
        screens: {
            Auth: 'login',
            App: '',
        },
    },
};

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <LocationProvider>
                    <RideProvider>
                        <FoodCartProvider>
                            <NavigationContainer linking={linking}>
                                <RootNavigator />
                                <StatusBar style="light" />
                            </NavigationContainer>
                        </FoodCartProvider>
                    </RideProvider>
                </LocationProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

