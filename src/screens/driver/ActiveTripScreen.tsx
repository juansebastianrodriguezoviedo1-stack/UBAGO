import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

// Trip Status Enum
type TripStatus = 'GOING_TO_PICKUP' | 'ARRIVED_PICKUP' | 'IN_PROGRESS' | 'COMPLETED';

const ActiveTripScreen = () => {
    const navigation = useNavigation();
    const [status, setStatus] = useState<TripStatus>('GOING_TO_PICKUP');

    // Mock Data
    const tripData = {
        passenger: {
            name: "Ana María",
            phone: "+573001234567",
            photo: "https://i.pravatar.cc/150?img=5",
            rating: 4.9
        },
        origin: { lat: 5.3045, lng: -73.8169, label: "Parque Principal" },
        destination: { lat: 5.3100, lng: -73.8200, label: "Hospital El Salvador" },
        fare: 4500
    };

    const handleNextStep = () => {
        if (status === 'GOING_TO_PICKUP') {
            setStatus('ARRIVED_PICKUP');
        } else if (status === 'ARRIVED_PICKUP') {
            setStatus('IN_PROGRESS');
        } else if (status === 'IN_PROGRESS') {
            Alert.alert(
                "Finalizar Viaje",
                "¿Confirmas que has llegado al destino y finalizado el viaje?",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Finalizar",
                        onPress: () => {
                            setStatus('COMPLETED');
                            navigation.replace('RatePassenger' as never); // Navigate to rating
                        }
                    }
                ]
            );
        }
    };

    const getMainButtonText = () => {
        switch (status) {
            case 'GOING_TO_PICKUP': return "LLEGUE AL PUNTO";
            case 'ARRIVED_PICKUP': return "INICIAR VIAJE";
            case 'IN_PROGRESS': return "FINALIZAR VIAJE";
            default: return "CERRAR";
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'GOING_TO_PICKUP': return "Yendo por el pasajero";
            case 'ARRIVED_PICKUP': return "Esperando al pasajero";
            case 'IN_PROGRESS': return "En camino al destino";
            default: return "Viaje completado";
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'GOING_TO_PICKUP': return "bg-indigo-600";
            case 'ARRIVED_PICKUP': return "bg-orange-500";
            case 'IN_PROGRESS': return "bg-green-600";
            default: return "bg-gray-600";
        }
    };

    return (
        <View className="flex-1 bg-neutral-900">

            {/* Map Area */}
            <View className="flex-1 z-0">
                <MapView
                    provider={PROVIDER_GOOGLE}
                    className="w-full h-full"
                    customMapStyle={[
                        { "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
                        { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
                        { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
                        { "elementType": "labels.text.stroke", "stylers": [{ "color": "#212121" }] },
                    ]}
                    initialRegion={{
                        latitude: tripData.origin.lat,
                        longitude: tripData.origin.lng,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker coordinate={{ latitude: tripData.origin.lat, longitude: tripData.origin.lng }} title="Recoger" pinColor="indigo" />
                    <Marker coordinate={{ latitude: tripData.destination.lat, longitude: tripData.destination.lng }} title="Destino" pinColor="green" />
                    <Polyline
                        coordinates={[
                            { latitude: tripData.origin.lat, longitude: tripData.origin.lng },
                            { latitude: tripData.destination.lat, longitude: tripData.destination.lng }
                        ]}
                        strokeColor="#6366f1"
                        strokeWidth={4}
                    />
                </MapView>
            </View>

            {/* Top Info Card (Passenger) */}
            <SafeAreaView className="absolute top-0 left-0 right-0 p-4">
                <View className="bg-neutral-800/90 p-4 rounded-xl flex-row items-center justify-between border border-neutral-700 shadow-lg backdrop-blur-md">
                    <View className="flex-row items-center">
                        <Image source={{ uri: tripData.passenger.photo }} className="w-10 h-10 rounded-full mr-3 border border-white" />
                        <View>
                            <Text className="text-white font-bold">{tripData.passenger.name}</Text>
                            <Text className="text-neutral-400 text-xs">⭐ {tripData.passenger.rating}</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-green-600 p-2 rounded-full items-center justify-center w-10 h-10">
                        <Ionicons name="call" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Bottom Action Sheet */}
            <View className="bg-neutral-900 rounded-t-3xl p-6 shadow-2xl border-t border-neutral-700">

                {/* Status Indicator */}
                <View className="flex-row items-center justify-center mb-6">
                    <View className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`} />
                    <Text className="text-white font-semibold text-lg">{getStatusText()}</Text>
                </View>

                {/* Destination info if in progress */}
                {status === 'IN_PROGRESS' && (
                    <View className="flex-row items-center mb-6 bg-neutral-800 p-3 rounded-xl border border-neutral-700">
                        <Ionicons name="location" size={24} color="#ef4444" className="mr-3" />
                        <View className="flex-1">
                            <Text className="text-neutral-400 text-xs">Destino</Text>
                            <Text className="text-white font-bold text-base" numberOfLines={1}>{tripData.destination.label}</Text>
                        </View>
                    </View>
                )}

                {/* Pickup info if Going */}
                {(status === 'GOING_TO_PICKUP' || status === 'ARRIVED_PICKUP') && (
                    <View className="flex-row items-center mb-6 bg-neutral-800 p-3 rounded-xl border border-neutral-700">
                        <Ionicons name="navigate" size={24} color="#6366f1" className="mr-3" />
                        <View className="flex-1">
                            <Text className="text-neutral-400 text-xs">Recoger en</Text>
                            <Text className="text-white font-bold text-base" numberOfLines={1}>{tripData.origin.label}</Text>
                        </View>
                    </View>
                )}

                {/* Main Action Button */}
                <TouchableOpacity
                    className={`p-4 rounded-full items-center shadow-lg ${status === 'IN_PROGRESS' ? 'bg-red-600' : 'bg-indigo-600'}`}
                    onPress={handleNextStep}
                >
                    <Text className="text-white font-bold text-xl">{getMainButtonText()}</Text>
                </TouchableOpacity>

                {/* Cancel Option */}
                {status !== 'IN_PROGRESS' && (
                    <TouchableOpacity className="mt-4 items-center" onPress={() => navigation.goBack()}>
                        <Text className="text-neutral-500 font-semibold underline">Cancelar Viaje</Text>
                    </TouchableOpacity>
                )}

            </View>

        </View>
    );
};

export default ActiveTripScreen;
