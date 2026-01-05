import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const VEHICLE_TYPES = ["Moto", "Carro 4P", "Carro 6P", "Camioneta"];

const EditVehicleScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    // Form State
    const [vehicleData, setVehicleData] = useState({
        type: "Moto",
        plate: "",
        brand: "",
        model: "",
        year: "",
        color: "",
        photo: null as string | null
    });

    const handleUpdate = (key: string, value: string) => {
        setVehicleData(prev => ({ ...prev, [key]: value }));
    };

    const pickImage = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para tomar la foto de la placa.');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setVehicleData(prev => ({ ...prev, photo: result.assets[0].uri }));
        }
    };

    const validateForm = () => {
        if (!vehicleData.plate || !vehicleData.brand || !vehicleData.model || !vehicleData.year || !vehicleData.color) {
            Alert.alert("Error", "Todos los campos son obligatorios");
            return false;
        }
        // Basic Colombian plate validation (simplified)
        const plateRegex = /^[A-Z]{3}[0-9]{2}[0-9A-Z]$/; // Generic check for demonstration
        // Note: Real validation logic should be more robust for different vehicle types

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Éxito", "Información del vehículo actualizada", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-neutral-900"
        >
            <View className="flex-row items-center p-4 pt-12 bg-neutral-800 border-b border-neutral-700">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Editar Vehículo</Text>
            </View>

            <ScrollView className="flex-1 p-6">

                {/* Vehicle Type Selector */}
                <Text className="text-neutral-400 mb-2 font-semibold">Tipo de Vehículo</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                    {VEHICLE_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => handleUpdate('type', type)}
                            className={`px-4 py-2 rounded-full border ${vehicleData.type === type ? 'bg-indigo-600 border-indigo-500' : 'bg-neutral-800 border-neutral-700'}`}
                        >
                            <Text className={vehicleData.type === type ? 'text-white font-bold' : 'text-neutral-400'}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Plate Photo (Large) */}
                <TouchableOpacity
                    onPress={pickImage}
                    className="w-full h-48 bg-neutral-800 rounded-2xl border-2 border-dashed border-neutral-600 items-center justify-center mb-8 overflow-hidden"
                >
                    {vehicleData.photo ? (
                        <Image source={{ uri: vehicleData.photo }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <View className="items-center">
                            <Ionicons name="camera" size={40} color="#525252" />
                            <Text className="text-neutral-500 mt-2">Toque para tomar foto de la Placa</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Form Fields */}
                <View className="space-y-4 mb-10">
                    <View>
                        <Text className="text-neutral-400 mb-1 ml-1 text-xs uppercase">Placa</Text>
                        <TextInput
                            className="bg-neutral-800 text-white p-4 rounded-xl border border-neutral-700 text-lg font-bold"
                            placeholder="ABC-123"
                            placeholderTextColor="#525252"
                            value={vehicleData.plate}
                            onChangeText={(t) => handleUpdate('plate', t.toUpperCase())}
                            maxLength={6}
                        />
                    </View>

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-neutral-400 mb-1 ml-1 text-xs uppercase">Marca</Text>
                            <TextInput
                                className="bg-neutral-800 text-white p-4 rounded-xl border border-neutral-700"
                                placeholder="Chevrolet"
                                placeholderTextColor="#525252"
                                value={vehicleData.brand}
                                onChangeText={(t) => handleUpdate('brand', t)}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-neutral-400 mb-1 ml-1 text-xs uppercase">Modelo (Ref)</Text>
                            <TextInput
                                className="bg-neutral-800 text-white p-4 rounded-xl border border-neutral-700"
                                placeholder="Spark GT"
                                placeholderTextColor="#525252"
                                value={vehicleData.model}
                                onChangeText={(t) => handleUpdate('model', t)}
                            />
                        </View>
                    </View>

                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-neutral-400 mb-1 ml-1 text-xs uppercase">Año</Text>
                            <TextInput
                                className="bg-neutral-800 text-white p-4 rounded-xl border border-neutral-700"
                                placeholder="2020"
                                placeholderTextColor="#525252"
                                keyboardType="numeric"
                                value={vehicleData.year}
                                onChangeText={(t) => handleUpdate('year', t)}
                                maxLength={4}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-neutral-400 mb-1 ml-1 text-xs uppercase">Color</Text>
                            <TextInput
                                className="bg-neutral-800 text-white p-4 rounded-xl border border-neutral-700"
                                placeholder="Rojo"
                                placeholderTextColor="#525252"
                                value={vehicleData.color}
                                onChangeText={(t) => handleUpdate('color', t)}
                            />
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    className={`p-4 rounded-xl items-center mb-12 ${loading ? 'bg-indigo-800' : 'bg-indigo-600 active:bg-indigo-700'} shadow-lg`}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Guardar Vehículo</Text>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditVehicleScreen;
