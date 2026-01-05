import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const FoodOrderTrackingScreen = () => {
    const navigation = useNavigation();
    const [statusStep, setStatusStep] = useState(0); // 0: Confirmed, 1: Prep, 2: On Way, 3: Delivered

    const STATUSES = [
        { title: "Confirmado", desc: "El restaurante aceptó tu pedido" },
        { title: "Preparando", desc: "Tu comida se está cocinando" },
        { title: "En Camino", desc: "El repartidor va hacia ti" },
        { title: "Entregado", desc: "¡Disfruta tu comida!" },
    ];

    // Simulate progress
    useEffect(() => {
        const timer = setInterval(() => {
            setStatusStep(prev => (prev < 3 ? prev + 1 : prev));
        }, 5000); // Fast mock progress
        return () => clearInterval(timer);
    }, []);

    const driver = {
        name: "Carlos P.",
        plate: "XYZ-123",
        rating: 4.8,
        photo: "https://i.pravatar.cc/150?img=12"
    };

    return (
        <View className="flex-1 bg-neutral-900">
            {/* Map Background */}
            <View className="flex-1">
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
                        latitude: 5.3045, longitude: -73.8169, latitudeDelta: 0.01, longitudeDelta: 0.01,
                    }}
                >
                    {/* Only show Driver Marker if On Way */}
                    {statusStep >= 2 && statusStep < 3 && (
                        <Marker coordinate={{ latitude: 5.3060, longitude: -73.8180 }} title="Repartidor">
                            <View className="bg-orange-500 p-2 rounded-full border-2 border-white">
                                <Ionicons name="bicycle" size={20} color="white" />
                            </View>
                        </Marker>
                    )}
                    <Marker coordinate={{ latitude: 5.3045, longitude: -73.8169 }} title="Tu Ubicación" pinColor="indigo" />
                </MapView>
            </View>

            {/* Back Button */}
            <SafeAreaView className="absolute top-0 left-0 p-4">
                <TouchableOpacity onPress={() => navigation.navigate('FoodHome' as never)} className="bg-neutral-900/50 p-3 rounded-full backdrop-blur-md">
                    <Ionicons name="home" size={24} color="white" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Bottom Status Card */}
            <View className="absolute bottom-0 left-0 right-0 bg-neutral-900 rounded-t-3xl border-t border-neutral-700 p-6 pb-10 shadow-2xl">

                {/* Status Header */}
                <View className="mb-6">
                    <Text className="text-neutral-500 text-xs font-bold uppercase mb-1">Estado del Pedido</Text>
                    <Text className="text-white text-2xl font-bold">{STATUSES[statusStep].title}</Text>
                    <Text className="text-neutral-400">{STATUSES[statusStep].desc}</Text>
                </View>

                {/* Progress Bar */}
                <View className="flex-row mb-8 h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <View className={`flex-1 ${statusStep >= 0 ? 'bg-green-500' : 'bg-transparent'}`} />
                    <View className="w-1 bg-neutral-900" />
                    <View className={`flex-1 ${statusStep >= 1 ? 'bg-green-500' : 'bg-transparent'}`} />
                    <View className="w-1 bg-neutral-900" />
                    <View className={`flex-1 ${statusStep >= 2 ? 'bg-green-500' : 'bg-transparent'}`} />
                    <View className="w-1 bg-neutral-900" />
                    <View className={`flex-1 ${statusStep >= 3 ? 'bg-green-500' : 'bg-transparent'}`} />
                </View>

                {/* Driver Info (Conditional) */}
                {statusStep >= 2 && (
                    <View className="flex-row items-center bg-neutral-800 p-4 rounded-xl border border-neutral-700">
                        <Image source={{ uri: driver.photo }} className="w-12 h-12 rounded-full mr-3" />
                        <View className="flex-1">
                            <Text className="text-white font-bold">{driver.name}</Text>
                            <Text className="text-neutral-400 text-xs">Repartidor • {driver.rating} ⭐</Text>
                        </View>
                        <TouchableOpacity className="bg-green-600 p-3 rounded-full">
                            <Ionicons name="call" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}

                {statusStep === 3 && (
                    <TouchableOpacity
                        className="bg-indigo-600 p-4 rounded-xl items-center mt-2"
                        onPress={() => navigation.navigate('FoodHome' as never)}
                    >
                        <Text className="text-white font-bold">¡Pedido Recibido!</Text>
                    </TouchableOpacity>
                )}

            </View>
        </View>
    );
};

export default FoodOrderTrackingScreen;
