import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginPhone from '../screens/LoginScreen'; // Renamed for simplicity
import BottomTabNavigator from './BottomTabNavigator';
import DriverNavigator from './DriverNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return null; // Or a splash screen
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isAuthenticated ? (
                <Stack.Screen name="Auth" component={LoginPhone} />
            ) : (
                user?.role === 'driver' ? (
                    <Stack.Screen name="DriverApp" component={DriverNavigator} />
                ) : (
                    <Stack.Screen name="App" component={BottomTabNavigator} />
                )
            )}
        </Stack.Navigator>
    );
}
