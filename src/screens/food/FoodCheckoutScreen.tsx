import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useFoodCart } from '../../context/FoodCartContext';
import { PaymentService } from '../../services/payment.service';
import * as Linking from 'expo-linking';

const PAYMENT_METHODS = [
    { id: 'cash', name: 'Efectivo', icon: 'cash-outline', subtitle: 'Pagas al recibir' },
    { id: 'card', name: 'Tarjeta Crédito/Débito (Wompi)', icon: 'card-outline', subtitle: 'Visa, Mastercard, Nequi' },
    { id: 'wallet', name: 'Billetera UBAGO', icon: 'wallet-outline', subtitle: 'Saldo: $50.000' }
];

const FoodCheckoutScreen = () => {
    const navigation = useNavigation();
    const { items, total, clearCart, restaurantId } = useFoodCart();
    const [selectedMethod, setSelectedMethod] = useState('cash');
    const [loading, setLoading] = useState(false);

    // Si no hay ítems en el carrito, mostramos un valor de demostración premium o el total real
    const totalAmount = total > 0 ? total : 34500;
    const deliveryFee = 3500;
    const finalTotal = totalAmount + deliveryFee;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(val);
    };

    const handlePlaceOrder = async () => {
        if (!auth.currentUser) {
            Alert.alert("Acceso Requerido", "Debes iniciar sesión para completar tu pedido.");
            return;
        }

        if (total === 0) {
            Alert.alert("Carrito Vacío", "No tienes productos en tu carrito para realizar un pedido.");
            return;
        }

        setLoading(true);
        try {
            const referenceId = `UBAGO-ORD-${Date.now()}`;
            const userEmail = auth.currentUser.email || 'usuario-ubago@example.com';

            // Estructurar los datos de la orden para Firestore
            const orderData = {
                userId: auth.currentUser.uid,
                restaurantId: restaurantId || 'generic_restaurant_id',
                status: selectedMethod === 'card' ? 'pending_payment' : 'new',
                paymentMethod: selectedMethod,
                paymentReference: referenceId,
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    extras: item.extras || ''
                })),
                subtotal: totalAmount,
                deliveryFee: deliveryFee,
                total: finalTotal,
                createdAt: serverTimestamp(),
                deliveryAddress: "Calle 5 #10-23, Ubaté", // Dirección demo o del perfil
                devicePlatform: 'mobile-expo'
            };

            if (selectedMethod === 'card') {
                // Flujo con Wompi - Generar Link de pago seguro
                const amountInCents = finalTotal * 100;
                const checkoutUrl = PaymentService.generateWompiPaymentLink({
                    amountInCents,
                    reference: referenceId,
                    email: userEmail
                });

                // Registrar orden en Firebase como pendiente de pago
                const docRef = await addDoc(collection(db, "food_orders"), orderData);
                console.log("Orden Wompi registrada en Firebase: ", docRef.id);

                setLoading(false);
                clearCart();

                Alert.alert(
                    "Proceder al Pago",
                    "Te redirigiremos a la pasarela segura de Wompi para completar tu pago con Tarjeta o Nequi.",
                    [
                        {
                            text: "Cancelar",
                            style: "cancel"
                        },
                        {
                            text: "Pagar con Wompi",
                            onPress: async () => {
                                const supported = await Linking.canOpenURL(checkoutUrl);
                                if (supported) {
                                    await Linking.openURL(checkoutUrl);
                                    // Navegar a tracking con estado pendiente de pago
                                    (navigation as any).navigate('FoodOrderTracking', { orderId: docRef.id });
                                } else {
                                    Alert.alert("Error", "No se pudo abrir el enlace de pago de Wompi.");
                                }
                            }
                        }
                    ]
                );

            } else {
                // Flujo en Efectivo o Billetera
                const docRef = await addDoc(collection(db, "food_orders"), orderData);
                console.log("Orden en Efectivo registrada en Firebase: ", docRef.id);

                setLoading(false);
                clearCart();

                Alert.alert(
                    "¡Pedido Exitoso!",
                    "Tu orden ha sido enviada al restaurante y se preparará de inmediato.",
                    [
                        {
                            text: "Ver Seguimiento",
                            onPress: () => {
                                (navigation as any).navigate('FoodOrderTracking', { orderId: docRef.id });
                            }
                        }
                    ]
                );
            }

        } catch (e) {
            console.error("Error creating food order: ", e);
            setLoading(false);
            Alert.alert("Error de Conexión", "No se pudo procesar tu pedido. Por favor intenta de nuevo.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-950">
            {/* Header premium con gradiente implícito */}
            <View className="flex-row items-center justify-between p-4 border-b border-neutral-900 bg-neutral-900/60">
                <View className="flex-row items-center">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        className="mr-4 w-10 h-10 rounded-full bg-neutral-800 items-center justify-center border border-neutral-700/50"
                    >
                        <Ionicons name="arrow-back" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white tracking-tight">Confirmar Pedido</Text>
                </View>
                <Ionicons name="shield-checkmark" size={22} color="#6366f1" />
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>

                {/* Resumen del Total Premium */}
                <View className="mb-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 bg-neutral-900 p-6 rounded-2xl border border-neutral-800/80 shadow-lg shadow-black/20 items-center">
                    <Text className="text-neutral-400 font-medium mb-1">Total Neto a Pagar</Text>
                    <Text className="text-4xl font-extrabold text-indigo-400 tracking-tight">{formatCurrency(finalTotal)}</Text>
                    <View className="flex-row justify-between w-full mt-4 pt-4 border-t border-neutral-800/60">
                        <Text className="text-neutral-400 text-xs">Subtotal: {formatCurrency(totalAmount)}</Text>
                        <Text className="text-neutral-400 text-xs">Domicilio: {formatCurrency(deliveryFee)}</Text>
                    </View>
                </View>

                {/* Métodos de Pago */}
                <Text className="text-neutral-200 font-bold text-lg mb-3 ml-1">Método de Pago</Text>
                <View className="mb-6">
                    {PAYMENT_METHODS.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            className={`flex-row items-center p-4 rounded-xl mb-3 border transition-all duration-300 ${selectedMethod === method.id ? 'bg-indigo-950/30 border-indigo-500/80 shadow-md shadow-indigo-900/10' : 'bg-neutral-900 border-neutral-800/70'}`}
                            onPress={() => setSelectedMethod(method.id)}
                        >
                            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${selectedMethod === method.id ? 'bg-indigo-600/80' : 'bg-neutral-800 border border-neutral-700/30'}`}>
                                <Ionicons name={method.icon as any} size={20} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className={`font-bold text-base ${selectedMethod === method.id ? 'text-indigo-200' : 'text-neutral-300'}`}>{method.name}</Text>
                                <Text className="text-neutral-500 text-xs mt-0.5">{method.subtitle}</Text>
                            </View>
                            {selectedMethod === method.id ? (
                                <Ionicons name="checkmark-circle" size={24} color="#6366f1" />
                            ) : (
                                <View className="w-5 h-5 rounded-full border-2 border-neutral-700" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Detalles de Entrega */}
                <Text className="text-neutral-200 font-bold text-lg mb-3 ml-1">Detalles de Entrega</Text>
                <View className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 mb-8">
                    <View className="flex-row items-start mb-4">
                        <View className="w-8 h-8 rounded-full bg-amber-500/10 items-center justify-center mr-3 mt-0.5">
                            <Ionicons name="location" size={18} color="#f59e0b" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-sm">Dirección de Entrega</Text>
                            <Text className="text-neutral-400 text-xs mt-0.5">Calle 5 #10-23, Ubaté</Text>
                        </View>
                    </View>
                    <View className="flex-row items-start">
                        <View className="w-8 h-8 rounded-full bg-emerald-500/10 items-center justify-center mr-3 mt-0.5">
                            <Ionicons name="time" size={18} color="#10b981" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-sm">Tiempo Estimado</Text>
                            <Text className="text-neutral-400 text-xs mt-0.5">30 - 45 min (Preparado al instante)</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            {/* Bottom Bar con botón de confirmación premium */}
            <View className="p-4 bg-neutral-950 border-t border-neutral-900">
                <TouchableOpacity
                    className={`rounded-xl p-4 flex-row justify-center items-center shadow-lg ${loading ? 'bg-indigo-900/60' : 'bg-indigo-600 shadow-indigo-900/20'}`}
                    onPress={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" className="mr-2" />
                    ) : (
                        <>
                            <Ionicons name="wallet-outline" size={20} color="white" className="mr-2" />
                            <Text className="text-white font-bold text-lg">Confirmar y Pagar</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FoodCheckoutScreen;
