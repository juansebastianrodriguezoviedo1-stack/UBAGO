import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import FoodHomeScreen from '../screens/food/FoodHomeScreen';
import FoodRestaurantScreen from '../screens/food/FoodRestaurantScreen';
import FoodCartScreen from '../screens/food/FoodCartScreen';
import FoodCheckoutScreen from '../screens/food/FoodCheckoutScreen';
import FoodOrderTrackingScreen from '../screens/food/FoodOrderTrackingScreen';
import FoodOrderHistoryScreen from '../screens/food/FoodOrderHistoryScreen';
import FoodRatingModal from '../screens/food/FoodRatingModal';

const Stack = createNativeStackNavigator();

const FoodNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#171717' } }}>
            <Stack.Screen name="FoodHome" component={FoodHomeScreen} />
            <Stack.Screen name="FoodRestaurant" component={FoodRestaurantScreen} />
            <Stack.Screen name="FoodCart" component={FoodCartScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="FoodCheckout" component={FoodCheckoutScreen} />
            <Stack.Screen name="FoodOrderTracking" component={FoodOrderTrackingScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="FoodOrderHistory" component={FoodOrderHistoryScreen} />
            <Stack.Screen name="FoodRating" component={FoodRatingModal} options={{ presentation: 'transparentModal' }} />
        </Stack.Navigator>
    );
};

export default FoodNavigator;
