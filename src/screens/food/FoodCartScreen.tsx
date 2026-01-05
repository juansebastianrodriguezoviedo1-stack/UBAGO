import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FoodCartScreen = () => {
    const navigation = useNavigation();
    // Mock Cart Data
    const [cartItems, setCartItems] = useState([
        { id: '1', name: 'Combo Whopper', price: 28000, quantity: 1, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80', extras: 'Sin cebolla' },
        { id: '2', name: 'Nuggets x10', price: 15900, quantity: 2, image: 'https://images.unsplash.com/photo-1562967960-f55430ed51f8?w=500&q=80', extras: 'Salsa BBQ' },
    ]);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const removeItem = (id: string) => {
        Alert.alert(
            "Eliminar producto",
            "¿Estás seguro?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar", style: "destructive", onPress: () => {
                        setCartItems(prev => prev.filter(item => item.id !== id));
                    }
                }
            ]
        );
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = 3500;
    const serviceFee = 1500;
    const total = subtotal + deliveryFee + serviceFee;

    if (cartItems.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-neutral-900 items-center justify-center">
                <Ionicons name="cart-outline" size={80} color="#525252" />
                <Text className="text-white text-xl font-bold mt-4">Tu carrito está vacío</Text>
                <Text className="text-neutral-500 mt-2 mb-8">Agrega algo delicioso para comer.</Text>
                <TouchableOpacity
                    className="bg-indigo-600 px-8 py-3 rounded-full"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white font-bold">Explorar Restaurantes</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-neutral-900">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-neutral-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Tu Pedido</Text>
            </View>

            <ScrollView className="flex-1 p-4">

                {/* Address Section */}
                <View className="bg-neutral-800 p-4 rounded-2xl mb-6 border border-neutral-700">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="location" size={20} color="#fbbf24" className="mr-2" />
                        <Text className="text-neutral-400 font-bold uppercase text-xs">Entregar en</Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <View className="flex-1">
                            <Text className="text-white font-bold text-base" numberOfLines={1}>Casa - Calle 5 #10-23</Text>
                            <Text className="text-neutral-500 text-xs">Ubaté, Cundinamarca</Text>
                        </View>
                        <TouchableOpacity>
                            <Text className="text-indigo-400 font-semibold text-sm">Cambiar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Items List */}
                <View className="mb-6">
                    {cartItems.map((item) => (
                        <View key={item.id} className="flex-row mb-4 bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
                            <Image source={{ uri: item.image }} className="w-16 h-16 rounded-lg bg-neutral-700 mr-3" />
                            <View className="flex-1 justify-center">
                                <Text className="text-white font-bold text-base">{item.name}</Text>
                                <Text className="text-neutral-500 text-xs mb-2">{item.extras}</Text>
                                <Text className="text-green-500 font-bold">${(item.price * item.quantity).toLocaleString()}</Text>
                            </View>

                            <View className="items-end justify-between">
                                <TouchableOpacity onPress={() => removeItem(item.id)}>
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                </TouchableOpacity>

                                <View className="flex-row items-center bg-neutral-900 rounded-lg border border-neutral-700 mt-2">
                                    <TouchableOpacity
                                        className="w-8 h-8 items-center justify-center"
                                        onPress={() => updateQuantity(item.id, -1)}
                                    >
                                        <Text className="text-white font-bold text-lg">-</Text>
                                    </TouchableOpacity>
                                    <Text className="text-white font-bold w-6 text-center">{item.quantity}</Text>
                                    <TouchableOpacity
                                        className="w-8 h-8 items-center justify-center"
                                        onPress={() => updateQuantity(item.id, 1)}
                                    >
                                        <Text className="text-white font-bold text-lg">+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Note */}
                <View className="mb-6">
                    <Text className="text-neutral-400 mb-2 text-sm ml-1">Nota para el restaurante</Text>
                    <TextInput
                        className="bg-neutral-800 text-white p-4 rounded-xl border border-neutral-700 min-h-[80px]"
                        placeholder="Ej: Sin cubiertos, salsa aparte..."
                        placeholderTextColor="#525252"
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Summary */}
                <View className="bg-neutral-800 p-4 rounded-2xl mb-8 border border-neutral-700">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-neutral-400">Subtotal</Text>
                        <Text className="text-white font-semibold">${subtotal.toLocaleString()}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-neutral-400">Costo de envío</Text>
                        <Text className="text-white font-semibold">${deliveryFee.toLocaleString()}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-neutral-400">Tarifa de servicio</Text>
                        <Text className="text-white font-semibold">${serviceFee.toLocaleString()}</Text>
                    </View>
                    <View className="h-px bg-neutral-700 my-2" />
                    <View className="flex-row justify-between items-center">
                        <Text className="text-white font-bold text-lg">Total</Text>
                        <Text className="text-green-500 font-bold text-xl">${total.toLocaleString()}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Button */}
            <View className="p-4 bg-neutral-900 border-t border-neutral-800">
                <TouchableOpacity
                    className="bg-green-600 rounded-xl p-4 flex-row justify-between items-center shadow-lg shadow-green-900/40"
                    onPress={() => navigation.navigate('FoodCheckout' as never)}
                >
                    <Text className="text-white font-bold text-lg">Ir a Pagar</Text>
                    <Text className="text-white font-bold text-lg">${total.toLocaleString()}</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default FoodCartScreen;
