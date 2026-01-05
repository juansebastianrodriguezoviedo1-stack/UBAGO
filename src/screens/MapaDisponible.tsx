import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRide } from '../context/RideContext';

export default function MapaDisponible() {
    const { availableRides, acceptRide } = useRide();

    const handleAccept = async (rideId: string) => {
        try {
            await acceptRide(rideId);
            alert('Viaje aceptado');
            // Navigation to ActiveRide would happen here or via root navigator state change
        } catch (error) {
            console.error(error);
            alert('Error al aceptar viaje');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <StatusBar style="light" />

            <View className="p-4 border-b border-gray-800">
                <Text className="text-white text-2xl font-bold">Solicitudes ({availableRides.length})</Text>
                <Text className="text-[#00D084] font-bold">En línea • Buscando viajes...</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {availableRides.length === 0 ? (
                    <Text className="text-gray-500 text-center mt-10">Esperando solicitudes...</Text>
                ) : (
                    availableRides.map((req) => (
                        <View key={req.id} className="bg-[#1a1a1a] rounded-xl p-5 mb-4 border border-gray-800 shadow-lg">

                            {/* Route Info */}
                            <View className="mb-4">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-2 h-2 rounded-full bg-[#00D084] mr-2" />
                                    <Text className="text-gray-300 font-bold">{req.origen.address || 'Origen'}</Text>
                                </View>
                                <View className="h-4 border-l border-gray-600 ml-1 mb-1" />
                                <View className="flex-row items-center">
                                    <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                                    <Text className="text-white font-bold text-lg">{req.destino.address || 'Destino'}</Text>
                                </View>
                            </View>

                            {/* Price & Distance */}
                            <View className="flex-row justify-between items-center mb-4 border-t border-gray-800 pt-3">
                                <View>
                                    <Text className="text-yellow-400 font-bold text-2xl">${req.tarifa}</Text>
                                    <Text className="text-gray-500 text-xs">Oferta del pasajero</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-white font-bold">{req.tipoVehiculo}</Text>
                                    <Text className="text-gray-500 text-xs">{req.pasajeroId}</Text>
                                </View>
                            </View>

                            {/* Actions */}
                            <View className="flex-row gap-3">
                                <TouchableOpacity className="flex-1 bg-[#2563eb] p-3 rounded-lg items-center">
                                    <Text className="text-white font-bold">Contraoferta</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleAccept(req.id)}
                                    className="flex-1 bg-[#00D084] p-3 rounded-lg items-center"
                                >
                                    <Text className="text-black font-bold">Aceptar</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    )))}
            </ScrollView>
        </SafeAreaView>
    );
}
