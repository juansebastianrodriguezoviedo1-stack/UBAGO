import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ORDERS = [
    {
        id: '101',
        restaurant: "Burger King - Ubaté",
        date: "02 Ene, 7:30 PM",
        items: "1x Combo Whopper, 1x Nuggets",
        total: 43900,
        status: "Entregado",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80"
    },
    {
        id: '102',
        restaurant: "Pizzería La Mía",
        date: "28 Dic, 1:15 PM",
        items: "1x Pizza Hawaiana Familiar",
        total: 35000,
        status: "Entregado",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80"
    },
    {
        id: '103',
        restaurant: "Sushi Go",
        date: "25 Dic, 8:00 PM",
        items: "2x California Roll",
        total: 55000,
        status: "Cancelado",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80"
    }
];

const FoodOrderHistoryScreen = () => {
    const navigation = useNavigation();

    const renderOrder = ({ item }: { item: any }) => (
        <View className="bg-neutral-800 p-4 rounded-xl mb-4 border border-neutral-700">
            <View className="flex-row mb-3">
                <Image source={{ uri: item.image }} className="w-12 h-12 rounded-lg mr-3" />
                <View className="flex-1">
                    <View className="flex-row justify-between items-start">
                        <Text className="text-white font-bold text-base flex-1">{item.restaurant}</Text>
                        <Text className={`text-xs font-bold px-2 py-1 rounded ${item.status === 'Entregado' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                            {item.status}
                        </Text>
                    </View>
                    <Text className="text-neutral-500 text-xs mt-1">{item.date}</Text>
                </View>
            </View>

            <View className="bg-neutral-900/50 p-3 rounded-lg mb-3">
                <Text className="text-neutral-400 text-xs mb-1">{item.items}</Text>
                <Text className="text-white font-bold text-sm">Total: ${item.total.toLocaleString()}</Text>
            </View>

            <TouchableOpacity className="flex-row items-center justify-center p-2 rounded-lg border border-neutral-600 active:bg-neutral-700">
                <Ionicons name="refresh" size={16} color="white" className="mr-2" />
                <Text className="text-white font-semibold text-sm">Pedir de nuevo</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-neutral-900">
            <View className="flex-row items-center p-4 pt-2 border-b border-neutral-800">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-white">Mis Pedidos</Text>
            </View>

            <FlatList
                data={ORDERS}
                renderItem={renderOrder}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
            />
        </SafeAreaView>
    );
};

export default FoodOrderHistoryScreen;
