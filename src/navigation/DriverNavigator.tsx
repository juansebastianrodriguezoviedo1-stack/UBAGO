import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Platform } from 'react-native';

// Screens
import DriverTripsScreen from '../screens/driver/DriverTripsScreen';
import EarningsScreen from '../screens/driver/EarningsScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';
import EditVehicleScreen from '../screens/driver/EditVehicleScreen';
import ActiveTripScreen from '../screens/driver/ActiveTripScreen';
import RatePassengerScreen from '../screens/driver/RatePassengerScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator
const DriverTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#171717', // neutral-900
                    borderTopWidth: 0,
                    elevation: 0,
                    height: Platform.OS === 'ios' ? 85 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#6366f1', // indigo-500
                tabBarInactiveTintColor: '#525252', // neutral-600
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600'
                }
            }}
        >
            <Tab.Screen
                name="Trips"
                component={DriverTripsScreen}
                options={{
                    tabBarLabel: 'Viajes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="navigate" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Earnings"
                component={EarningsScreen}
                options={{
                    tabBarLabel: 'Ganancias',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cash" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={DriverProfileScreen}
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

// Top Level Stack for Driver
const DriverNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#171717' } }}>
            <Stack.Screen name="DriverTabs" component={DriverTabs} />
            <Stack.Screen name="EditVehicle" component={EditVehicleScreen} />
            <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="RatePassenger" component={RatePassengerScreen} options={{ gestureEnabled: false }} />
        </Stack.Navigator>
    );
};

export default DriverNavigator;
