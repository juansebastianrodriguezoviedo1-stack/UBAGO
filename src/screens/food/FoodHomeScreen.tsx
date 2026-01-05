import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CATEGORIES = [
    { id: '1', name: 'Pizza', icon: '🍕' },
    { id: '2', name: 'Hamburguesas', icon: '🍔' },
    { id: '3', name: 'Sushi', icon: '🍣' },
    { id: '4', name: 'Mexicana', icon: '🌮' },
    { id: '5', name: 'Postres', icon: '🍩' },
    { id: '6', name: 'Saludable', icon: '🥗' },
];

const RESTAURANTS = [
    {
        id: 'r1',
        name: "Burger King - Ubaté",
        rating: 4.5,
        time: "30-45 min",
        deliveryFee: 3500,
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&q=80",
        categories: ["Hamburguesas", "Americana"]
    },
    {
        id: 'r2',
        name: "Pizzería La Mía",
        rating: 4.8,
        time: "40-55 min",
        deliveryFee: 4000,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
        categories: ["Pizza", "Italiana"]
    },
    {
        id: 'r3',
        name: "Sushi Go",
        rating: 4.7,
        time: "35-50 min",
        deliveryFee: 3000,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
        categories: ["Sushi", "Asiática"]
    }
];

const FoodHomeScreen = () => {
    const navigation = useNavigation();
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const renderRestaurant = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={{
                marginBottom: 16,
                backgroundColor: '#262626', // neutral-800 
                borderRadius: 16,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#404040', // neutral-700
                flex: 1,
                marginHorizontal: 8,
                minWidth: '45%',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
            onPress={() => (navigation as any).navigate('FoodRestaurant', { restaurant: item })}
        >
            <Image source={{ uri: item.image }} style={{ width: '100%', height: 120 }} resizeMode="cover" />

            {/* Discount/Promo Tag */}
            <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#16a34a', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>Gratis</Text>
            </View>

            {/* Time Badge */}
            <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }}>
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 10 }}>{item.time}</Text>
            </View>

            <View style={{ padding: 12 }}>
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }} numberOfLines={1}>{item.name}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="star" size={12} color="#fbbf24" style={{ marginRight: 4 }} />
                        <Text style={{ color: '#d4d4d4', fontSize: 12, fontWeight: 'bold' }}>{item.rating}</Text>
                    </View>
                    <Text style={{ color: '#22c55e', fontSize: 12, fontWeight: '600' }}>${item.deliveryFee}</Text>
                </View>

                <Text style={{ color: '#737373', fontSize: 10 }} numberOfLines={1}>{item.categories.join(' • ')}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#171717' }}>
            <View style={{ flex: 1, padding: 16 }}>

                {/* Header Search */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <View style={{ flex: 1, backgroundColor: '#262626', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 999, borderWidth: 1, borderColor: '#404040', marginRight: 12 }}>
                        <Ionicons name="search" size={20} color="#737373" style={{ marginRight: 8 }} />
                        <TextInput
                            placeholder="¿Qué se te antoja?"
                            placeholderTextColor="#737373"
                            style={{ flex: 1, color: 'white', fontWeight: '500' }}
                        />
                    </View>
                    <TouchableOpacity style={{ width: 48, height: 48, backgroundColor: '#262626', borderRadius: 999, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#404040' }}>
                        <Ionicons name="filter" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Categories (Horizontal) */}
                <View style={{ marginBottom: 16, height: 100 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginBottom: 8, marginLeft: 4 }}>Categorías</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 4 }}>
                        <TouchableOpacity
                            onPress={() => setActiveCategory(null)}
                            style={{ alignItems: 'center', marginRight: 16, width: 64, opacity: !activeCategory ? 1 : 0.6 }}
                        >
                            <View style={{ width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4, backgroundColor: !activeCategory ? '#4f46e5' : '#262626', borderWidth: 1, borderColor: '#404040' }}>
                                <Ionicons name="grid" size={20} color="white" />
                            </View>
                            <Text style={{ color: 'white', fontSize: 10, textAlign: 'center', fontWeight: '500' }}>Todo</Text>
                        </TouchableOpacity>

                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={{ alignItems: 'center', marginRight: 16, width: 64 }}
                                onPress={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                            >
                                <View style={{ width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4, backgroundColor: '#262626', borderWidth: 1, borderColor: activeCategory === cat.id ? '#6366f1' : '#404040' }}>
                                    <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
                                </View>
                                <Text style={{ fontSize: 10, textAlign: 'center', fontWeight: '500', color: activeCategory === cat.id ? '#818cf8' : '#a3a3a3' }}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Restaurant List */}
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginBottom: 8, marginLeft: 4 }}>Restaurantes Populares</Text>
                <FlatList
                    data={RESTAURANTS}
                    renderItem={renderRestaurant}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 4 }}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />

            </View>

            {/* Floating Cart Button (Demo - conditional check needed typically) */}
            <View style={{ position: 'absolute', bottom: 24, right: 16 }}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#16a34a', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 999, shadowColor: '#14532d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 }}
                    onPress={() => (navigation as any).navigate('FoodCart')}
                >
                    <View style={{ backgroundColor: '#166534', borderRadius: 999, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>3</Text>
                    </View>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginRight: 8 }}>Ver Carrito</Text>
                    <Text style={{ color: '#bbf7d0', fontWeight: '600', fontSize: 14 }}>$45.000</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default FoodHomeScreen;
