import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const EarningsScreen = () => {
    const navigation = useNavigation();

    // Mock Data
    const stats = {
        today: 85000,
        week: 450000,
        month: 1200000,
    };

    const chartData = [15000, 30000, 45000, 20000, 60000, 40000, 85000]; // Last 7 days
    const maxVal = Math.max(...chartData);

    const recentTrips = [
        { id: '1', date: 'Hoy, 10:30 AM', amount: 8500, type: 'Moto', status: 'Completado' },
        { id: '2', date: 'Hoy, 09:15 AM', amount: 12000, type: 'Carro', status: 'Completado' },
        { id: '3', date: 'Ayer, 06:45 PM', amount: 7000, type: 'Moto', status: 'Completado' },
        { id: '4', date: 'Ayer, 05:20 PM', amount: 15000, type: 'Camioneta', status: 'Completado' },
        { id: '5', date: 'Ayer, 02:10 PM', amount: 6500, type: 'Moto', status: 'Completado' },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);
    };

    const renderTrip = ({ item }: { item: any }) => (
        <View className="flex-row items-center justify-between p-4 bg-neutral-800 mb-2 rounded-xl border border-neutral-700">
            <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${item.type === 'Moto' ? 'bg-orange-900/40' : 'bg-blue-900/40'}`}>
                    <Ionicons name={item.type === 'Moto' ? 'bicycle' : 'car'} size={20} color={item.type === 'Moto' ? '#fb923c' : '#60a5fa'} />
                </View>
                <View>
                    <Text className="text-white font-bold">{formatCurrency(item.amount)}</Text>
                    <Text className="text-neutral-400 text-xs">{item.date}</Text>
                </View>
            </View>
            <View className="items-end">
                <Text className="text-green-500 text-xs font-semibold">{item.status}</Text>
                <Text className="text-neutral-500 text-xs mt-1">{item.type}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-neutral-900">
            <View className="p-4 pt-12 pb-4 bg-neutral-800 border-b border-neutral-700 rounded-b-3xl z-10 shadow-lg">
                <Text className="text-white text-2xl font-bold mb-1">Mis Ganancias</Text>
                <Text className="text-neutral-400">Resumen de actividad financiera</Text>
            </View>

            <ScrollView className="flex-1 p-4">

                {/* Main Stats Cards */}
                <View className="flex-row gap-2 mb-6">
                    <View className="flex-1 bg-indigo-600 p-4 rounded-2xl items-start shadow-indigo-500/20 shadow-lg">
                        <View className="bg-indigo-500/30 p-2 rounded-lg mb-2">
                            <Ionicons name="calendar" size={20} color="white" />
                        </View>
                        <Text className="text-indigo-200 text-xs mb-1 font-semibold">HOY</Text>
                        <Text className="text-white text-xl font-bold">{formatCurrency(stats.today)}</Text>
                    </View>
                    <View className="flex-1 bg-neutral-800 p-4 rounded-2xl items-start border border-neutral-700">
                        <View className="bg-neutral-700 p-2 rounded-lg mb-2">
                            <Ionicons name="calendar-outline" size={20} color="#a3a3a3" />
                        </View>
                        <Text className="text-neutral-400 text-xs mb-1 font-semibold">ESTA SEMANA</Text>
                        <Text className="text-white text-xl font-bold">{formatCurrency(stats.week)}</Text>
                    </View>
                </View>

                {/* Weekly Chart (Custom Implementation) */}
                <View className="bg-neutral-800 p-5 rounded-2xl border border-neutral-700 mb-6">
                    <Text className="text-white font-bold mb-4">Tendencia (Últimos 7 días)</Text>
                    <View className="h-40 flex-row items-end justify-between space-x-2">
                        {chartData.map((val, index) => {
                            const heightPercentage = (val / maxVal) * 100;
                            return (
                                <View key={index} className="flex-1 items-center">
                                    <View
                                        className="w-full bg-indigo-500 rounded-t-sm opacity-80"
                                        style={{ height: `${heightPercentage}%`, minHeight: 10 }}
                                    />
                                    <Text className="text-neutral-500 text-[10px] mt-1">D{index + 1}</Text>
                                </View>
                            )
                        })}
                    </View>
                </View>

                {/* Recent Trips Header */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-white font-bold text-lg">Viajes Recientes</Text>
                    <TouchableOpacity>
                        <Text className="text-indigo-400 font-semibold">Ver Todo</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Trips List (Limited) */}
                <View className="mb-20">
                    {recentTrips.map((trip) => (
                        <View key={trip.id}>
                            {renderTrip({ item: trip })}
                        </View>
                    ))}
                </View>

            </ScrollView>

            {/* Floating Request Payout Button - Bottom of screen */}
            <View className="absolute bottom-6 left-4 right-4">
                <TouchableOpacity className="bg-green-600 p-4 rounded-xl flex-row items-center justify-center shadow-lg active:bg-green-700">
                    <Ionicons name="cash" size={24} color="white" className="mr-2" />
                    <Text className="text-white font-bold text-lg ml-2">Solicitar Retiro</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default EarningsScreen;
