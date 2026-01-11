import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

const PAYMENT_METHODS = [
    { id: 'cash', name: 'Efectivo', icon: 'cash-outline', subtitle: 'Pagas al recibir' },
    { id: 'card', name: 'Tarjeta Crédito/Débito', icon: 'card-outline', subtitle: '**** 1234' },
    { id: 'wallet', name: 'Billetera UBAGO', icon: 'wallet-outline', subtitle: 'Saldo: $50.000' }
];

const FoodCheckoutScreen = () => {
    const navigation = useNavigation();
    const [selectedMethod, setSelectedMethod] = useState('cash');
    const [loading, setLoading] = useState(false);

    const handlePlaceOrder = async () => {
        if (!auth.currentUser) {
            Alert.alert("Error", "Debes iniciar sesión para pedir.");
            return;
        }

        setLoading(true);
        try {
            // Create Order Object
            const orderData = {
                userId: auth.currentUser.uid,
                status: 'created', // Initial status
                totalAmount: 34500, // Hardcoded for now as in the UI, normally comes from CartContext
                items: [], // Should come from CartContext
                paymentMethod: selectedMethod,
                createdAt: serverTimestamp(),
                deliveryAddress: "Calle 5 #10-23, Ubaté", // Should come from User Profile/Context
                restaurantId: "generic_restaurant_id" // Placeholder
            };

            const docRef = await addDoc(collection(db, "orders"), orderData);
            console.log("Order written with ID: ", docRef.id);

            setLoading(false);
            // Navigate to Tracking with ID
            navigation.navigate('FoodOrderTracking' as never, { orderId: docRef.id } as never);

        } catch (e) {
            console.error("Error adding document: ", e);
            setLoading(false);
            Alert.alert("Error", "No se pudo crear la orden. Intente de nuevo.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-900">
            <View className="flex-row items-center p-4 border-b border-neutral-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Confirmar Pago</Text>
            </View>

            <ScrollView className="flex-1 p-4">

                {/* Order Summary (Brief) */}
                <View className="mb-8 items-center">
                    <Text className="text-neutral-400 mb-2">Total a Pagar</Text>
                    <Text className="text-4xl font-bold text-white">$34.500</Text>
                </View>

                <Text className="text-white font-bold text-lg mb-4 ml-1">Método de Pago</Text>
                <View className="mb-8">
                    {PAYMENT_METHODS.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            className={`flex-row items-center p-4 rounded-xl mb-3 border ${selectedMethod === method.id ? 'bg-indigo-900/30 border-indigo-500' : 'bg-neutral-800 border-neutral-700'}`}
                            onPress={() => setSelectedMethod(method.id)}
                        >
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${selectedMethod === method.id ? 'bg-indigo-600' : 'bg-neutral-700'}`}>
                                <Ionicons name={method.icon as any} size={20} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className={`font-bold text-base ${selectedMethod === method.id ? 'text-white' : 'text-neutral-300'}`}>{method.name}</Text>
                                <Text className="text-neutral-500 text-xs">{method.subtitle}</Text>
                            </View>
                            {selectedMethod === method.id && (
                                <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Delivery Info Verification */}
                <Text className="text-white font-bold text-lg mb-4 ml-1">Detalles de Entrega</Text>
                <View className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 mb-4">
                    <View className="flex-row items-start mb-4">
                        <Ionicons name="location" size={20} color="#fbbf24" className="mr-3 mt-1" />
                        <View>
                            <Text className="text-white font-semibold">Casa</Text>
                            <Text className="text-neutral-400 text-sm">Calle 5 #10-23, Ubaté</Text>
                        </View>
                    </View>
                    <View className="flex-row items-start">
                        <Ionicons name="time" size={20} color="#fbbf24" className="mr-3 mt-1" />
                        <View>
                            <Text className="text-white font-semibold">Tiempo Estimado</Text>
                            <Text className="text-neutral-400 text-sm">30 - 45 min</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            <View className="p-4 bg-neutral-900 border-t border-neutral-800">
                <TouchableOpacity
                    className={`rounded-xl p-4 flex-row justify-center items-center shadow-lg ${loading ? 'bg-indigo-800' : 'bg-indigo-600 shadow-indigo-900/40'}`}
                    onPress={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" className="mr-2" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Realizar Pedido</Text>
                    )}
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default FoodCheckoutScreen;
