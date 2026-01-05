import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Screens & Navigators
import MapaHome from '../screens/MapaHome';
import FoodNavigator from './FoodNavigator'; // Import Food Stack
import Historial from '../screens/Historial';
import Perfil from '../screens/Perfil';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#171717', // neutral-900
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#6366f1', // indigo-500
                tabBarInactiveTintColor: '#525252', // neutral-600
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600'
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: any;

                    if (route.name === 'Movilidad') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === 'Comida') {
                        iconName = focused ? 'fast-food' : 'fast-food-outline';
                    } else if (route.name === 'Historial') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Movilidad" component={MapaHome} />
            <Tab.Screen name="Comida" component={FoodNavigator} />
            <Tab.Screen name="Historial" component={Historial} />
            <Tab.Screen name="Perfil" component={Perfil} />
        </Tab.Navigator>
    );
}
