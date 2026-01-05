import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FoodRatingModal = () => {
    const navigation = useNavigation();
    const [restRating, setRestRating] = useState(0);
    const [driverRating, setDriverRating] = useState(0);

    const handleSubmit = () => {
        Alert.alert("Gracias", "Tus calificaciones ayudan a mejorar el servicio.", [
            { text: "OK", onPress: () => navigation.goBack() }
        ]);
    };

    const renderStars = (rating: number, setRating: (r: number) => void) => (
        <View className="flex-row gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons name={star <= rating ? "star" : "star-outline"} size={32} color={star <= rating ? "#fbbf24" : "#525252"} />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View className="flex-1 bg-black/80 justify-center p-6">
            <View className="bg-neutral-900 rounded-3xl p-6 shadow-2xl border border-neutral-700">
                <Text className="text-white font-bold text-center text-xl mb-6">Califica tu Pedido</Text>

                {/* Restaurant */}
                <View className="mb-6 items-center">
                    <Text className="text-neutral-400 mb-2 font-semibold">Burger King</Text>
                    {renderStars(restRating, setRestRating)}
                </View>

                <View className="h-px bg-neutral-800 w-full mb-6" />

                {/* Driver */}
                <View className="mb-8 items-center">
                    <Text className="text-neutral-400 mb-2 font-semibold">Repartidor (Carlos)</Text>
                    {renderStars(driverRating, setDriverRating)}
                </View>

                <TouchableOpacity
                    className={`w-full py-4 rounded-full items-center ${restRating > 0 && driverRating > 0 ? 'bg-indigo-600' : 'bg-neutral-700'}`}
                    onPress={handleSubmit}
                    disabled={!(restRating > 0 && driverRating > 0)}
                >
                    <Text className="text-white font-bold text-lg">Enviar</Text>
                </TouchableOpacity>

                <TouchableOpacity className="mt-4 p-2 items-center" onPress={() => navigation.goBack()}>
                    <Text className="text-neutral-500 font-semibold">Omitir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FoodRatingModal;
