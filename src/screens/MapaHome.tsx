import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, StyleSheet, KeyboardAvoidingView, FlatList, ActivityIndicator } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';
import { useRide } from '../context/RideContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { GoogleService, PlacePrediction } from '../services/google.service';

const VEHICLE_OPTIONS = [
    { id: 'moto', label: 'Moto', price: 3000, icon: '🏍️' },
    { id: 'carro', label: 'Carro', price: 5000, icon: '🚗' },
    { id: 'camioneta', label: 'Camioneta', price: 8000, icon: '🚙' },
];

const DARK_MAP_STYLE = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#242f3e" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#746855" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#242f3e" }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#d59563" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#263c3f" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#6b9a76" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#38414e" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#212a37" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9ca5b3" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#746855" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{ "color": "#1f2835" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#f3d19c" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#17263c" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#515c6d" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#17263c" }]
    }
];

export default function MapaHome() {
    const [selectedVehicle, setSelectedVehicle] = useState<'moto' | 'carro' | 'camioneta'>('moto');
    const [offerPrice, setOfferPrice] = useState('5000');

    // Inputs
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');

    // Suggestion State
    const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
    const [isSearching, setIsSearching] = useState<'origin' | 'destination' | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isGpsLoading, setIsGpsLoading] = useState(false);

    const { createRideRequest } = useRide();
    const { location, getCurrentLocation } = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleSearch = async (text: string, type: 'origin' | 'destination') => {
        if (type === 'origin') setOrigin(text);
        else setDestination(text);

        if (text.length > 2) {
            setIsSearching(type);
            const results = await GoogleService.getPlacePredictions(text);
            setPredictions(results);
        } else {
            setPredictions([]);
            setIsSearching(null);
        }
    };

    const handleSelectPrediction = (prediction: PlacePrediction) => {
        if (isSearching === 'origin') {
            setOrigin(prediction.description);
        } else {
            setDestination(prediction.description);
        }
        setPredictions([]);
        setIsSearching(null);
    };

    const handleUseCurrentLocation = async () => {
        setIsGpsLoading(true);
        // 1. Get accurate location
        await getCurrentLocation();

        // 2. Refresh location object (simulate/force usage of current state if race condition)
        // Ideally we pass the coords directly if available
        const currentLoc = location;

        if (currentLoc) {
            // 3. Reverse Geocode for text
            const address = await GoogleService.reverseGeocode(location.latitude, location.longitude);
            if (address) {
                setOrigin(address); // Set exact text
            } else {
                setOrigin("Ubicación exacta desconocida");
            }

            // 4. Force map to center on THIS location
            // We can use a ref here if we had one, but state update should trigger re-render
            // Let's rely on the region prop updating or use a small timeout to force re-center if user panned away
        } else {
            // Retry once if location was null
            const freshLoc = await getCurrentLocation(); // Should return coords in a real impl
        }
        setIsGpsLoading(false);
    };

    const handleRequestRide = async () => {
        if (!origin || !destination) {
            alert('Por favor ingresa origen y destino');
            return;
        }

        setIsLoading(true);
        try {
            await createRideRequest({
                pasajeroId: user?.uid || 'unknown',
                origen: { address: origin, latitude: location?.latitude || 0, longitude: location?.longitude || 0 },
                destino: { address: destination, latitude: 0, longitude: 0 },
                tipoVehiculo: selectedVehicle,
                tarifa: parseInt(offerPrice),
            });
            alert('¡Solicitud enviada!');
        } catch (error) {
            alert('Error al solicitar viaje');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Map */}
            {Platform.OS === 'web' ? (
                <View style={styles.mapWeb}><Text style={{ color: '#aaa' }}>Map placeholder</Text></View>
            ) : (
                <View style={{ flex: 1, position: 'relative' }}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        customMapStyle={DARK_MAP_STYLE}
                        region={location ? {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005, // Closer zoom
                            longitudeDelta: 0.005,
                        } : {
                            latitude: 5.3086,
                            longitude: -73.8153,
                            latitudeDelta: 0.02,
                            longitudeDelta: 0.02,
                        }}
                        showsUserLocation={true}
                        onRegionChangeComplete={(region) => {
                            // Optional: Reverse geocode center
                        }}
                    />

                    {/* CENTER PIN with PULSE */}
                    <View style={styles.centerMarkerContainer} pointerEvents="none">
                        <View style={styles.pulseRing} />
                        <Text style={{ fontSize: 40, marginBottom: 10 }}>📍</Text>
                        {origin ? (
                            <View style={styles.addressPill}>
                                <Text style={styles.addressText} numberOfLines={1}>{origin}</Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            )}

            {/* Bottom Sheet */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.bottomSheetContainer}
                pointerEvents="box-none"
            >
                <View style={styles.bottomSheet}>

                    {/* Inputs */}
                    <View style={styles.inputGroup}>
                        {/* Origin with GPS Button */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Origen</Text>
                            <View style={styles.rowInput}>
                                <TextInput
                                    value={origin}
                                    onChangeText={(text) => handleSearch(text, 'origin')}
                                    placeholder="¿Dónde estás?"
                                    placeholderTextColor="#666"
                                    style={[styles.input, { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}
                                />
                                <TouchableOpacity
                                    style={styles.gpsButton}
                                    onPress={handleUseCurrentLocation}
                                >
                                    {isGpsLoading ? <ActivityIndicator color="#000" size="small" /> : <Text style={{ fontSize: 20 }}>📍</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Destination */}
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Destino</Text>
                            <TextInput
                                value={destination}
                                onChangeText={(text) => handleSearch(text, 'destination')}
                                placeholder="¿A dónde vas?"
                                placeholderTextColor="#666"
                                style={styles.input}
                            />
                        </View>

                        {/* Suggestions List (Using zIndex to float) */}
                        {predictions.length > 0 && (
                            <View style={styles.predictionsContainer}>
                                <FlatList
                                    data={predictions}
                                    keyExtractor={item => item.place_id}
                                    keyboardShouldPersistTaps="handled"
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.predictionItem}
                                            onPress={() => handleSelectPrediction(item)}
                                        >
                                            <Text style={styles.predictionMain}>{item.structured_formatting.main_text}</Text>
                                            <Text style={styles.predictionSub}>{item.structured_formatting.secondary_text}</Text>
                                            <View style={styles.separator} />
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}
                    </View>

                    {/* Vehicle */}
                    {predictions.length === 0 && (
                        <>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleScroll} contentContainerStyle={styles.vehicleContent}>
                                {VEHICLE_OPTIONS.map((vehicle) => (
                                    <TouchableOpacity
                                        key={vehicle.id}
                                        onPress={() => setSelectedVehicle(vehicle.id as any)}
                                        style={[
                                            styles.vehicleCard,
                                            selectedVehicle === vehicle.id ? styles.vehicleCardActive : {}
                                        ]}
                                    >
                                        <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                                        <Text style={[
                                            styles.vehicleLabel,
                                            selectedVehicle === vehicle.id ? styles.textActive : styles.textInactive
                                        ]}>{vehicle.label}</Text>
                                        <Text style={styles.vehiclePrice}>${vehicle.price}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Offer */}
                            <View style={styles.actionRow}>
                                <View style={styles.offerContainer}>
                                    <Text style={styles.label}>Tu Oferta</Text>
                                    <TextInput
                                        value={offerPrice}
                                        onChangeText={setOfferPrice}
                                        keyboardType="numeric"
                                        style={styles.offerInput}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={handleRequestRide}
                                    disabled={isLoading}
                                    style={[styles.button, isLoading ? styles.buttonDisabled : {}]}
                                >
                                    <Text style={styles.buttonText}>{isLoading ? 'Enviando...' : 'Solicitar Viaje'}</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    map: { width: '100%', height: '100%', position: 'absolute' },
    mapWeb: { width: '100%', height: '100%', position: 'absolute', backgroundColor: '#242f3e', alignItems: 'center', justifyContent: 'center' },

    // Bottom Sheet
    bottomSheetContainer: { position: 'absolute', bottom: 0, width: '100%', justifyContent: 'flex-end', zIndex: 1 },
    bottomSheet: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 50, // More bottom padding for safety
        borderTopWidth: 1,
        borderTopColor: '#333',
        width: '100%'
    },

    // Inputs
    inputGroup: { marginBottom: 20, gap: 12, zIndex: 20 },
    inputWrapper: { marginBottom: 0, zIndex: 20 },
    rowInput: { flexDirection: 'row', alignItems: 'center' },
    label: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 6, textTransform: 'uppercase', marginLeft: 4 },
    input: { backgroundColor: '#2a2a2a', color: 'white', padding: 14, borderRadius: 12, fontSize: 16, borderWidth: 1, borderColor: '#333', height: 50 },
    gpsButton: {
        backgroundColor: '#00D084', height: 50, width: 50,
        borderTopRightRadius: 12, borderBottomRightRadius: 12,
        alignItems: 'center', justifyContent: 'center', marginLeft: -2, zIndex: 21
    },

    // Autocomplete Dropdown
    predictionsContainer: {
        position: 'absolute',
        top: 65, // Just below the input
        left: 0,
        right: 0,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        maxHeight: 180,
        zIndex: 1000, // Very high zIndex
        borderWidth: 1,
        borderColor: '#444',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    predictionItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#333' },
    predictionMain: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    predictionSub: { color: '#aaa', fontSize: 12, marginTop: 2 },
    separator: { height: 0 },

    // Vehicle Selection
    vehicleScroll: { marginBottom: 10, height: 120, flexGrow: 0, zIndex: 1 },
    vehicleContent: { paddingVertical: 5, paddingRight: 20 },
    vehicleCard: {
        padding: 10, borderRadius: 12, marginRight: 12, width: 100, height: 100,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#2a2a2a', borderWidth: 1, borderColor: '#333'
    },
    vehicleCardActive: { borderColor: '#00D084', backgroundColor: 'rgba(0, 208, 132, 0.1)' },
    vehicleIcon: { fontSize: 30, marginBottom: 6 },
    vehicleLabel: { fontWeight: 'bold', fontSize: 13, marginBottom: 2, color: 'white' },
    vehiclePrice: { color: '#888', fontSize: 11 },
    textActive: { color: '#00D084' },
    textInactive: { color: '#888' },

    // Offer & Button
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
    offerContainer: { flex: 1 },
    offerInput: {
        backgroundColor: '#2a2a2a', color: '#00D084', fontSize: 20, fontWeight: 'bold',
        padding: 14, borderRadius: 12, textAlign: 'center', borderWidth: 1, borderColor: '#333', height: 60
    },
    button: {
        flex: 2, backgroundColor: '#00D084', padding: 16, borderRadius: 12,
        alignItems: 'center', justifyContent: 'center', height: 60
    },
    buttonDisabled: { backgroundColor: '#444' },
    buttonText: { color: '#000', fontWeight: 'bold', fontSize: 18 },

    // Map Pin
    centerMarkerContainer: {
        position: 'absolute', top: '50%', left: '50%',
        marginLeft: -20, marginTop: -45, // Offset to center the BOTTOM of the pin
        alignItems: 'center', justifyContent: 'center',
        zIndex: 10
    },
    pulseRing: {
        position: 'absolute', bottom: 5,
        width: 20, height: 10, borderRadius: 10,
        backgroundColor: 'rgba(0, 208, 132, 0.5)',
        transform: [{ scaleX: 2 }]
    },
    addressPill: {
        position: 'absolute', top: -40,
        backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 5,
        borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
        maxWidth: 200
    },
    addressText: { fontSize: 10, fontWeight: 'bold', color: 'black' }
});
