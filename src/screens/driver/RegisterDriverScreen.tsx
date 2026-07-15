import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { FirestoreService } from '../../services/firestore.service';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterDriverScreen() {
    const { user } = useAuth();
    const navigation = useNavigation();

    // Form Stats
    const [vehicleType, setVehicleType] = useState<'moto' | 'carro'>('moto');
    const [plate, setPlate] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!plate || !model || !color) {
            Alert.alert('Error', 'Por favor completa todos los campos del vehículo.');
            return;
        }

        if (!user) return;

        setLoading(true);
        try {
            await FirestoreService.updateUser(user.uid, {
                role: 'driver', // Or 'pending_driver' if approval needed
                vehiculo: {
                    placa: plate.toUpperCase(),
                    modelo: model,
                    color: color,
                    tipo: vehicleType
                }
            });

            Alert.alert('¡Éxito!', 'Ahora eres un conductor registrado.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo registrar conductor. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Registrar Vehículo</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scroll}>

                    <Text style={styles.subtitle}>
                        Completa la información de tu vehículo para comenzar a recibir viajes.
                    </Text>

                    {/* Vehicle Type Selection */}
                    <Text style={styles.label}>TIPO DE VEHÍCULO</Text>
                    <View style={styles.typeContainer}>
                        <TouchableOpacity
                            style={[styles.typeOption, vehicleType === 'moto' && styles.typeActive]}
                            onPress={() => setVehicleType('moto')}
                        >
                            <Text style={styles.typeEmoji}>🏍️</Text>
                            <Text style={[styles.typeText, vehicleType === 'moto' && styles.textActive]}>Moto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.typeOption, vehicleType === 'carro' && styles.typeActive]}
                            onPress={() => setVehicleType('carro')}
                        >
                            <Text style={styles.typeEmoji}>🚗</Text>
                            <Text style={[styles.typeText, vehicleType === 'carro' && styles.textActive]}>Carro</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Inputs */}
                    <View style={styles.inputGroup}>
                        <View>
                            <Text style={styles.label}>PLACA</Text>
                            <TextInput
                                style={styles.input}
                                value={plate}
                                onChangeText={setPlate}
                                placeholder="AAA-123"
                                placeholderTextColor="#666"
                                autoCapitalize="characters"
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>MODELO / REFERENCIA</Text>
                            <TextInput
                                style={styles.input}
                                value={model}
                                onChangeText={setModel}
                                placeholder="Ej: Bajaj Pulsar NS200"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View>
                            <Text style={styles.label}>COLOR</Text>
                            <TextInput
                                style={styles.input}
                                value={color}
                                onChangeText={setColor}
                                placeholder="Ej: Negro Mate"
                                placeholderTextColor="#666"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'REGISTRANDO...' : 'REGISTRARME COMO CONDUCTOR'}
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', paddingTop: 50 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    backButton: { marginRight: 15, padding: 5 },
    title: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    scroll: { padding: 24 },
    subtitle: { color: '#888', fontSize: 14, marginBottom: 30, lineHeight: 20 },

    label: { color: '#666', fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginLeft: 4 },
    inputGroup: { gap: 20, marginBottom: 40 },
    input: {
        backgroundColor: '#1E1E1E', color: 'white', padding: 16, borderRadius: 12,
        borderWidth: 1, borderColor: '#333', fontSize: 16
    },

    // Vehicle Type
    typeContainer: { flexDirection: 'row', gap: 15, marginBottom: 30 },
    typeOption: {
        flex: 1, backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12,
        alignItems: 'center', borderWidth: 1, borderColor: '#333'
    },
    typeActive: { borderColor: '#00D084', backgroundColor: 'rgba(0, 208, 132, 0.1)' },
    typeEmoji: { fontSize: 32, marginBottom: 8 },
    typeText: { color: '#888', fontWeight: 'bold' },
    textActive: { color: '#00D084' },

    button: {
        backgroundColor: '#00D084', padding: 18, borderRadius: 12, alignItems: 'center',
        shadowColor: '#00D084', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: '#000', fontWeight: 'bold', fontSize: 16 }
});
