import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Switch, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const DriverProfileScreen = () => {
    const navigation = useNavigation();
    const [isOnline, setIsOnline] = useState(false);

    // Mock data - replace with UserContext/Firebase data later
    const driver = {
        name: "Juan Rodríguez",
        rating: 4.8,
        phone: "+57 300 123 4567",
        document: "1.018.456.789",
        photoURL: "https://i.pravatar.cc/150?img=11",
        vehicle: {
            type: "Moto",
            plate: "XYZ-123",
            model: "Yamaha NMAX 2024"
        },
        stats: {
            trips: 142,
            earnings: "$1,250,500",
            hours: 45
        }
    };

    const toggleSwitch = () => setIsOnline(previousState => !previousState);

    return (
        <SafeAreaView className="flex-1 bg-neutral-900">
            <ScrollView className="flex-1">
                {/* Header Section */}
                <View className="items-center pt-8 pb-6 px-4 bg-neutral-800 rounded-b-3xl shadow-lg border-b border-neutral-700">
                    <View className="relative">
                        <Image
                            source={{ uri: driver.photoURL }}
                            className="w-28 h-28 rounded-full border-4 border-indigo-500"
                        />
                        <View className="absolute bottom-0 right-0 bg-yellow-500 px-2 py-1 rounded-full flex-row items-center border border-neutral-900">
                            <Ionicons name="star" size={14} color="black" />
                            <Text className="text-black font-bold ml-1 text-xs">{driver.rating}</Text>
                        </View>
                    </View>

                    <Text className="text-2xl font-bold text-white mt-4">{driver.name}</Text>
                    <Text className="text-neutral-400 text-sm mt-1">Socio {driver.vehicle.type}</Text>

                    {/* Status Toggle */}
                    <View className="flex-row items-center mt-6 bg-neutral-900 px-6 py-2 rounded-full border border-neutral-700">
                        <Text className={`font-semibold mr-3 ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                            {isOnline ? 'EN LÍNEA' : 'DESCONECTADO'}
                        </Text>
                        <Switch
                            trackColor={{ false: "#3f3f46", true: "#22c55e" }}
                            thumbColor={isOnline ? "#ffffff" : "#f4f3f4"}
                            onValueChange={toggleSwitch}
                            value={isOnline}
                        />
                    </View>
                </View>

                {/* Stats Summary */}
                <View className="flex-row justify-between px-4 mt-6">
                    <View className="items-center bg-neutral-800 p-4 rounded-2xl flex-1 mr-2 border border-neutral-700">
                        <Text className="text-indigo-400 font-bold text-lg">{driver.stats.trips}</Text>
                        <Text className="text-neutral-400 text-xs mt-1">Viajes</Text>
                    </View>
                    <View className="items-center bg-neutral-800 p-4 rounded-2xl flex-1 mx-2 border border-neutral-700">
                        <Text className="text-green-500 font-bold text-lg text-center">{driver.stats.earnings}</Text>
                        <Text className="text-neutral-400 text-xs mt-1">Ganancias</Text>
                    </View>
                    <View className="items-center bg-neutral-800 p-4 rounded-2xl flex-1 ml-2 border border-neutral-700">
                        <Text className="text-blue-400 font-bold text-lg">{driver.stats.hours}h</Text>
                        <Text className="text-neutral-400 text-xs mt-1">Horas</Text>
                    </View>
                </View>

                {/* Actions Menu */}
                <View className="px-4 mt-8 space-y-4 mb-10">
                    <Text className="text-neutral-500 font-bold mb-2 ml-2">MI CUENTA</Text>

                    <TouchableOpacity
                        className="flex-row items-center bg-neutral-800 p-4 rounded-2xl border border-neutral-700 active:bg-neutral-700"
                        onPress={() => { }} // TODO: Navigate to EditProfile
                    >
                        <View className="w-10 h-10 bg-indigo-500/20 rounded-full items-center justify-center mr-4">
                            <Ionicons name="person" size={20} color="#818cf8" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">Información Personal</Text>
                            <Text className="text-neutral-400 text-xs">Teléfono, Documento</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#737373" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center bg-neutral-800 p-4 rounded-2xl border border-neutral-700 active:bg-neutral-700"
                        onPress={() => navigation.navigate('EditVehicle' as never)}
                    >
                        <View className="w-10 h-10 bg-orange-500/20 rounded-full items-center justify-center mr-4">
                            <Ionicons name="car" size={20} color="#fb923c" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">Mi Vehículo</Text>
                            <Text className="text-neutral-400 text-xs">{driver.vehicle.plate} • {driver.vehicle.model}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#737373" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center bg-neutral-800 p-4 rounded-2xl border border-neutral-700 active:bg-neutral-700"
                        onPress={() => { }}
                    >
                        <View className="w-10 h-10 bg-blue-500/20 rounded-full items-center justify-center mr-4">
                            <Ionicons name="help-buoy" size={20} color="#60a5fa" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-base">Soporte</Text>
                            <Text className="text-neutral-400 text-xs">Ayuda y PQR</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#737373" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center bg-red-900/20 p-4 rounded-2xl border border-red-900/50 active:bg-red-900/30 mt-4"
                        onPress={() => { }} // TODO: Logout logic
                    >
                        <View className="w-10 h-10 bg-red-500/20 rounded-full items-center justify-center mr-4">
                            <Ionicons name="log-out" size={20} color="#f87171" />
                        </View>
                        <Text className="text-red-400 font-semibold text-base">Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DriverProfileScreen;
