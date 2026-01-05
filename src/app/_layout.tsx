import { Stack } from 'expo-router';
import "../../global.css";
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { LocationProvider } from '../context/LocationContext';
import { RideProvider } from '../context/RideContext';
import RootNavigator from '../navigation/RootNavigator';

export default function Layout() {
    return (
        <AuthProvider>
            <LocationProvider>
                <RideProvider>
                    <RootNavigator />
                </RideProvider>
            </LocationProvider>
        </AuthProvider>
    );
}
