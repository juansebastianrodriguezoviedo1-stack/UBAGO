import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RatePassengerScreen = () => {
    const navigation = useNavigation();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const tripSummary = {
        fare: 4500,
        passenger: {
            name: "Ana María",
            photo: "https://i.pravatar.cc/150?img=5"
        }
    };

    const handleRating = (stars: number) => {
        setRating(stars);
    };

    const handleSubmit = () => {
        if (rating === 0) {
            Alert.alert("Calificación requerida", "Por favor selecciona un número de estrellas");
            return;
        }

        Alert.alert(
            "¡Gracias!",
            "Tu calificación ha sido enviada.",
            [
                {
                    text: "Continuar",
                    onPress: () => {
                        // Reset to Driver Dashboard (Trips or Earnings)
                        // Using navigate to 'DriverTabs' or similar root
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'DriverTabs' as never }],
                        });
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-900 justify-center">
            <View className="p-6 items-center">

                {/* Earnings Summary */}
                <View className="mb-10 items-center">
                    <Text className="text-green-500 font-bold text-4xl mb-2">${tripSummary.fare}</Text>
                    <Text className="text-neutral-400 text-lg">Viaje Completado</Text>
                </View>

                {/* Passenger Info */}
                <View className="items-center mb-8">
                    <Image
                        source={{ uri: tripSummary.passenger.photo }}
                        className="w-24 h-24 rounded-full border-4 border-neutral-700 mb-4"
                    />
                    <Text className="text-white text-2xl font-bold">{tripSummary.passenger.name}</Text>
                    <Text className="text-neutral-500">¿Cómo estuvo el pasajero?</Text>
                </View>

                {/* Star Rating */}
                <View className="flex-row gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                            <Ionicons
                                name={star <= rating ? "star" : "star-outline"}
                                size={48}
                                color={star <= rating ? "#fbbf24" : "#525252"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Comment Input */}
                <View className="w-full mb-8">
                    <TextInput
                        className="bg-neutral-800 text-white p-4 rounded-xl border border-neutral-700 h-32"
                        placeholder="Escribe un comentario opcional..."
                        placeholderTextColor="#525252"
                        multiline
                        textAlignVertical="top"
                        value={comment}
                        onChangeText={setComment}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className={`w-full py-4 rounded-full items-center ${rating > 0 ? 'bg-indigo-600' : 'bg-neutral-700'}`}
                    onPress={handleSubmit}
                    disabled={rating === 0}
                >
                    <Text className="text-white font-bold text-lg">Enviar Calificación</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default RatePassengerScreen;
