import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SectionList, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Menu Data
const MENU_DATA = [
    {
        title: 'Populares',
        data: [
            { id: 'm1', name: 'Combo Whopper', description: 'Hamburguesa con queso, papas y gaseosa.', price: 28000, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80' },
            { id: 'm2', name: 'Nuggets x10', description: '10 piezas de pollo apanado + salsas.', price: 15900, image: 'https://images.unsplash.com/photo-1562967960-f55430ed51f8?w=500&q=80' },
        ]
    },
    {
        title: 'Hamburguesas',
        data: [
            { id: 'm3', name: 'Doble Carne', description: 'Dos carnes de res, tocineta y queso cheddar.', price: 32000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
            { id: 'm4', name: 'Pollo Crispy', description: 'Pollo apanado, lechuga y mayonesa.', price: 24000, image: 'https://images.unsplash.com/photo-1615297928064-24977384d0f5?w=500&q=80' },
        ]
    },
    {
        title: 'Bebidas',
        data: [
            { id: 'm5', name: 'Coca-Cola 1.5L', description: 'Gaseosa sabor original.', price: 8000, image: null },
            { id: 'm6', name: 'Limonada Natural', description: 'Bebida refrescante.', price: 6000, image: null },
        ]
    }
];

const FoodRestaurantScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { restaurant } = route.params as any || {}; // Fallback for safety

    const [cartCount, setCartCount] = useState(0);

    const handleAddToCart = (item: any) => {
        // Here we would open ProductDetailModal
        // For now, simple mock add
        setCartCount(prev => prev + 1);
        Alert.alert("Agregado", `Se agregó ${item.name} al carrito.`);
    };

    const renderMenuItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="flex-row p-4 bg-neutral-900 border-b border-neutral-800"
            onPress={() => handleAddToCart(item)}
        >
            <View className="flex-1 pr-4">
                <Text className="text-white font-bold text-lg mb-1">{item.name}</Text>
                <Text className="text-neutral-500 text-sm mb-2 leading-5" numberOfLines={2}>{item.description}</Text>
                <Text className="text-white font-semibold text-base">${item.price.toLocaleString()}</Text>
            </View>
            {item.image ? (
                <Image source={{ uri: item.image }} className="w-24 h-24 rounded-xl bg-neutral-800" />
            ) : (
                <View className="w-24 h-24 rounded-xl bg-neutral-800 items-center justify-center border border-neutral-700">
                    <Ionicons name="fast-food" size={24} color="#525252" />
                </View>
            )}
        </TouchableOpacity>
    );

    if (!restaurant) return <View className="flex-1 bg-neutral-900 items-center justify-center"><Text className="text-white">Cargando...</Text></View>;

    return (
        <View className="flex-1 bg-neutral-900">
            <StatusBar barStyle="light-content" />

            {/* Header Image */}
            <View className="h-64 relative">
                <Image source={{ uri: restaurant.image }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute inset-0 bg-black/40" />

                <SafeAreaView className="absolute top-0 left-0 right-0 p-4 flex-row justify-between">
                    <TouchableOpacity
                        className="w-10 h-10 bg-black/50 rounded-full items-center justify-center backdrop-blur-md"
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="w-10 h-10 bg-black/50 rounded-full items-center justify-center backdrop-blur-md"
                    >
                        <Ionicons name="share-social" size={20} color="white" />
                    </TouchableOpacity>
                </SafeAreaView>

                {/* Restaurant Info Card Overlay */}
                <View className="absolute -bottom-10 left-4 right-4 bg-neutral-800 p-4 rounded-xl shadow-lg border border-neutral-700">
                    <View className="flex-row justify-between items-start mb-2">
                        <Text className="text-white font-bold text-2xl flex-1">{restaurant.name}</Text>
                        <View className="bg-green-600 px-2 py-1 rounded">
                            <Text className="text-white text-xs font-bold">{restaurant.rating} ⭐</Text>
                        </View>
                    </View>
                    <Text className="text-neutral-400 text-sm mb-3">Hamburguesas • Americana • Comida Rápida</Text>

                    <View className="flex-row justify-between items-center pt-3 border-t border-neutral-700">
                        <View className="flex-row items-center">
                            <Ionicons name="time" size={16} color="#fbbf24" className="mr-1" />
                            <Text className="text-neutral-300 text-xs font-semibold">{restaurant.time}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="bicycle" size={16} color="#fbbf24" className="mr-1" />
                            <Text className="text-neutral-300 text-xs font-semibold">${restaurant.deliveryFee}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Menu List */}
            <SectionList
                sections={MENU_DATA}
                keyExtractor={(item, index) => item.id + index}
                renderItem={renderMenuItem}
                renderSectionHeader={({ section: { title } }) => (
                    <View className="bg-neutral-900 py-4 px-4 border-b border-neutral-800">
                        <Text className="text-white font-bold text-xl">{title}</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingTop: 60, paddingBottom: 100 }}
                stickySectionHeadersEnabled={true}
                showsVerticalScrollIndicator={false}
            />

            {/* View Cart Sticky Button */}
            {cartCount > 0 && (
                <View className="absolute bottom-6 left-4 right-4">
                    <TouchableOpacity
                        className="flex-row items-center justify-between bg-green-600 p-4 rounded-xl shadow-lg shadow-green-900/50"
                        onPress={() => navigation.navigate('FoodCart' as never)}
                    >
                        <View className="rounded-full bg-green-800 w-8 h-8 items-center justify-center">
                            <Text className="text-white font-bold">{cartCount}</Text>
                        </View>
                        <Text className="text-white font-bold text-lg">Ver pedido</Text>
                        <Text className="text-white font-bold text-lg">$ --</Text>
                    </TouchableOpacity>
                </View>
            )}

        </View>
    );
};

export default FoodRestaurantScreen;
