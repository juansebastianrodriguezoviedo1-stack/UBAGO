import { Platform } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export interface PlacePrediction {
    description: string;
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

export const GoogleService = {
    getPlacePredictions: async (input: string): Promise<PlacePrediction[]> => {
        if (!input || input.length < 3) return [];

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${API_KEY}&components=country:co&language=es`
            );
            const data = await response.json();

            if (data.status === 'OK') {
                return data.predictions;
            } else {
                console.warn('Google Places Error:', data.status);
                return [];
            }
        } catch (error) {
            console.error('Error fetching predictions:', error);
            return [];
        }
    },

    getPlaceDetails: async (placeId: string) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${API_KEY}`
            );
            const data = await response.json();
            if (data.status === 'OK') {
                return data.result.geometry.location;
            }
            return null;
        } catch (error) {
            console.error('Error fetching place details:', error);
            return null;
        }
    },

    reverseGeocode: async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
            );
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
                // Prioritize 'street_address' or 'route', otherwise use the first formatted_address
                const preciseAddress = data.results.find((r: any) =>
                    r.types.includes('street_address') || r.types.includes('route') || r.types.includes('premise')
                );

                return preciseAddress ? preciseAddress.formatted_address : data.results[0].formatted_address;
            }
            return 'Ubicación seleccionada';
        } catch (error) {
            console.error('Reverse Geocoding Error:', error);
            return null;
        }
    }
};
