import * as Location from 'expo-location';

export const LocationService = {
    requestPermissions: async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    },

    getCurrentLocation: async () => {
        try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
        } catch (error) {
            console.warn('Error fetching location, using fallback:', error);
            // Fallback to Ubaté Main Park
            return {
                latitude: 5.3086,
                longitude: -73.8153,
            };
        }
    },

    watchLocation: (callback: (loc: { latitude: number; longitude: number }) => void) => {
        return Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 3000, // Update every 3 seconds
                distanceInterval: 10, // Update every 10 meters
            },
            (location) => {
                callback({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
            }
        );
    }
};
