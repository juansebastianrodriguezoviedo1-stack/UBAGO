import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, Image, Animated, Easing, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const DriverTripsScreen = () => {
    const navigation = useNavigation();
    const [isOnline, setIsOnline] = useState(false);
    const [incomingTrip, setIncomingTrip] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(15);

    // Animation for radar
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isOnline) {
            startRadar();
        } else {
            stopRadar();
        }
    }, [isOnline]);

    const startRadar = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.5,
                    duration: 1500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 0,
                    useNativeDriver: true,
                })
            ])
        ).start();
    };

    const stopRadar = () => {
        pulseAnim.setValue(1);
        pulseAnim.stopAnimation();
    };

    // Simulate incoming trip
    const simulateTrip = () => {
        if (!isOnline) {
            Alert.alert("Estás desconectado", "Conéctate para recibir viajes.");
            return;
        }

        setIncomingTrip({
            id: 'trip_123',
            passenger: {
                name: 'Ana María',
                rating: 4.9,
                photo: 'https://i.pravatar.cc/150?img=5'
            },
            origin: 'Parque Principal Ubaté',
            destination: 'Hospital El Salvador',
            fare: 4500,
            distance: '2.5 km',
            time: '8 min'
        });
        setTimeLeft(15);
        startTimer();
    };

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    rejectTrip(); // Auto reject
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const acceptTrip = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIncomingTrip(null);
        // Navigate to Active Trip
        navigation.navigate('ActiveTrip' as never);
    };

    const rejectTrip = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIncomingTrip(null);
    };

    return (
        <View className="flex-1 bg-neutral-900">

            {/* Header Status */}
            <View className="absolute top-12 left-0 right-0 z-10 px-6 flex-row justify-between items-center">
                <View className={`px-4 py-2 rounded-full border ${isOnline ? 'bg-green-900/80 border-green-500' : 'bg-red-900/80 border-red-500'}`}>
                    <Text className="text-white font-bold text-xs">{isOnline ? 'EN LÍNEA: Buscando...' : 'DESCONECTADO'}</Text>
                </View>
                <TouchableOpacity
                    className="w-12 h-12 bg-neutral-800 rounded-full items-center justify-center border border-neutral-700 shadow-lg"
                    onPress={simulateTrip} // For testing
                >
                    <Ionicons name="bug-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Main Map Background (Dark Style) */}
            <View className="flex-1 rounded-3xl overflow-hidden m-0 opacity-50">
                {/* Placeholder for map if keys are missing */}
                <MapView
                    provider={PROVIDER_GOOGLE}
                    className="w-full h-full"
                    customMapStyle={[
                        {
                            "elementType": "geometry",
                            "stylers": [{ "color": "#212121" }]
                        },
                        {
                            "elementType": "labels.icon",
                            "stylers": [{ "visibility": "off" }]
                        },
                        {
                            "elementType": "labels.text.fill",
                            "stylers": [{ "color": "#757575" }]
                        },
                        {
                            "elementType": "labels.text.stroke",
                            "stylers": [{ "color": "#212121" }]
                        },
                        {
                            "featureType": "administrative",
                            "elementType": "geometry",
                            "stylers": [{ "color": "#757575" }]
                        },
                        {
                            "featureType": "road",
                            "elementType": "geometry.fill",
                            "stylers": [{ "color": "#2c2c2c" }]
                        },
                    ]}
                    region={{
                        latitude: 5.3045,
                        longitude: -73.8169, // Ubaté Coords
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                />
            </View>

            {/* Go Online Button / Radar */}
            <View className="absolute bottom-10 left-0 right-0 items-center justify-center">
                {!isOnline ? (
                    <TouchableOpacity
                        className="w-24 h-24 rounded-full bg-indigo-600 items-center justify-center shadow-lg border-4 border-indigo-400"
                        onPress={() => setIsOnline(true)}
                    >
                        <Ionicons name="power" size={40} color="white" />
                        <Text className="text-white font-bold text-xs mt-1">INICIAR</Text>
                    </TouchableOpacity>
                ) : (
                    <View className="items-center">
                        <Animated.View
                            style={{
                                transform: [{ scale: pulseAnim }],
                                opacity: pulseAnim.interpolate({ inputRange: [1, 1.5], outputRange: [0.6, 0] })
                            }}
                            className="absolute w-64 h-64 bg-indigo-500 rounded-full"
                        />
                        <TouchableOpacity
                            className="w-20 h-20 rounded-full bg-red-600 items-center justify-center shadow-lg border-4 border-red-400 z-10"
                            onPress={() => setIsOnline(false)}
                        >
                            <Ionicons name="stop" size={30} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white mt-4 font-semibold shadow-black drop-shadow-md">Escaneando zona...</Text>
                    </View>
                )}
            </View>

            {/* INCOMING TRIP MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={!!incomingTrip}
                onRequestClose={rejectTrip}
            >
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-neutral-900 rounded-t-3xl p-6 border-t border-neutral-700 shadow-2xl">

                        {/* Header: Service Type & Time */}
                        <View className="flex-row justify-between items-center mb-6">
                            <View className="bg-green-600 px-3 py-1 rounded-full">
                                <Text className="text-white font-bold text-xs">NUEVA SOLICITUD</Text>
                            </View>
                            <Text className="text-red-500 font-bold text-lg">{timeLeft}s</Text>
                        </View>

                        {/* Route Info */}
                        <View className="mb-6 relative">
                            <View className="absolute left-3 top-2 bottom-6 w-0.5 bg-neutral-700" />

                            <View className="flex-row items-center mb-4">
                                <View className="w-6 h-6 rounded-full bg-indigo-600 items-center justify-center z-10 mr-3 border-2 border-neutral-900">
                                    <View className="w-2 h-2 rounded-full bg-white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-neutral-400 text-xs uppercase">Recoger en</Text>
                                    <Text className="text-white font-bold text-lg" numberOfLines={1}>{incomingTrip?.origin}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center">
                                <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center z-10 mr-3 border-2 border-neutral-900">
                                    <View className="w-2 h-2 rounded-sm bg-white" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-neutral-400 text-xs uppercase">Llevar a</Text>
                                    <Text className="text-white font-bold text-lg" numberOfLines={1}>{incomingTrip?.destination}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Fare & Passenger */}
                        <View className="flex-row items-center justify-between mb-8 bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                            <View className="flex-row items-center">
                                <Image source={{ uri: incomingTrip?.passenger.photo }} className="w-12 h-12 rounded-full mr-3" />
                                <View>
                                    <Text className="text-white font-bold">{incomingTrip?.passenger.name}</Text>
                                    <View className="flex-row items-center">
                                        <Ionicons name="star" size={12} color="#fbbf24" />
                                        <Text className="text-neutral-400 text-xs ml-1">{incomingTrip?.passenger.rating}</Text>
                                    </View>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-green-500 font-bold text-2xl">${incomingTrip?.fare}</Text>
                                <Text className="text-neutral-400 text-xs">{incomingTrip?.distance} • {incomingTrip?.time}</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-4 mb-4">
                            <TouchableOpacity
                                className="flex-1 bg-neutral-800 py-4 rounded-full items-center border border-neutral-600"
                                onPress={rejectTrip}
                            >
                                <Text className="text-neutral-400 font-bold text-lg">Rechazar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 bg-green-600 py-4 rounded-full items-center shadow-lg shadow-green-900/50"
                                onPress={acceptTrip}
                            >
                                <Text className="text-white font-bold text-lg">Aceptar Viaje</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default DriverTripsScreen;
