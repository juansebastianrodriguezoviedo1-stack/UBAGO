import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FirestoreService } from '../../services/firestore.service';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RegisterBusinessScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        whatsapp: '',
        category: '', // will be split by comma
        preparationTimeMin: '20',
        bankType: 'nequi',
        bankNumber: '',
        bankHolder: ''
    });

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleRegister = async () => {
        if (!user) {
            Alert.alert("Error", "Debes iniciar sesión para registrar un negocio.");
            return;
        }

        if (!formData.name || !formData.address || !formData.phone) {
            Alert.alert("Faltan datos", "Por favor completa la información básica.");
            return;
        }

        setLoading(true);
        try {
            await FirestoreService.registerRestaurant({
                ownerUid: user.uid,
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                location: {
                    latitude: user.ubicacion_actual?.latitude || 0,
                    longitude: user.ubicacion_actual?.longitude || 0
                },
                category: formData.category.split(',').map(c => c.trim()),
                preparationTimeMin: parseInt(formData.preparationTimeMin) || 20,
                commissionRate: 20, // Default 20%
                bankAccount: {
                    type: formData.bankType as 'nequi' | 'bancolombia',
                    number: formData.bankNumber,
                    holderName: formData.bankHolder || user.nombre
                },
                // Default styles
                logoUrl: 'https://via.placeholder.com/150',
                bannerUrl: 'https://via.placeholder.com/500x200'
            });

            Alert.alert(
                "¡Registro Exitoso!",
                "Tu negocio ha sido registrado. Un administrador revisará tu solicitud para aprobarla.",
                [
                    { text: "OK", onPress: () => navigation.goBack() }
                ]
            );
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "No se pudo registrar el negocio. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Volver</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Registrar Negocio</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {step === 1 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.sectionTitle}>1. Información Básica</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre del Restaurante</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(t) => updateForm('name', t)}
                                placeholder="Ej. Hamburguesas El Corral"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Categoría (separadas por coma)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.category}
                                onChangeText={(t) => updateForm('category', t)}
                                placeholder="Ej. Rápida, Parrilla, Bebidas"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Dirección Física</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.address}
                                onChangeText={(t) => updateForm('address', t)}
                                placeholder="Ej. Cra 7 # 8-20"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <TouchableOpacity style={styles.nextButton} onPress={() => setStep(2)}>
                            <Text style={styles.buttonText}>Siguiente →</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.sectionTitle}>2. Operación y Contacto</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Teléfono</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(t) => updateForm('phone', t)}
                                keyboardType="phone-pad"
                                placeholder="300 123 4567"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>WhatsApp (para pedidos)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.whatsapp}
                                onChangeText={(t) => updateForm('whatsapp', t)}
                                keyboardType="phone-pad"
                                placeholder="300 123 4567"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tiempo Prep. (min)</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.preparationTimeMin}
                                onChangeText={(t) => updateForm('preparationTimeMin', t)}
                                keyboardType="numeric"
                                placeholder="20"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.rowButtons}>
                            <TouchableOpacity style={styles.backStepButton} onPress={() => setStep(1)}>
                                <Text style={styles.backStepText}>← Atrás</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.nextButton} onPress={() => setStep(3)}>
                                <Text style={styles.buttonText}>Siguiente →</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {step === 3 && (
                    <View style={styles.stepContainer}>
                        <Text style={styles.sectionTitle}>3. Datos Bancarios</Text>
                        <Text style={styles.subtitle}>Para recibir tus ganancias</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tipo de Cuenta</Text>
                            <View style={styles.typeSelector}>
                                <TouchableOpacity
                                    style={[styles.typeOption, formData.bankType === 'nequi' && styles.typeSelected]}
                                    onPress={() => updateForm('bankType', 'nequi')}
                                >
                                    <Text style={[styles.typeText, formData.bankType === 'nequi' && styles.typeTextSelected]}>Nequi</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.typeOption, formData.bankType === 'bancolombia' && styles.typeSelected]}
                                    onPress={() => updateForm('bankType', 'bancolombia')}
                                >
                                    <Text style={[styles.typeText, formData.bankType === 'bancolombia' && styles.typeTextSelected]}>Bancolombia</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Número de Cuenta / Celular</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.bankNumber}
                                onChangeText={(t) => updateForm('bankNumber', t)}
                                keyboardType="numeric"
                                placeholder="300..."
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre Titular</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.bankHolder}
                                onChangeText={(t) => updateForm('bankHolder', t)}
                                placeholder="Nombre completo"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View style={styles.rowButtons}>
                            <TouchableOpacity style={styles.backStepButton} onPress={() => setStep(2)}>
                                <Text style={styles.backStepText}>← Atrás</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.registerButton, loading && styles.disabledButton]}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.registerButtonText}>FINALIZAR REGISTRO</Text>}
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.disclaimer}>
                            Al registrarte aceptas la comisión del 20% por pedido realizado a través de la plataforma UBAGO.
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#1a1a1a',
    },
    backButton: {
        marginBottom: 10,
    },
    backText: {
        color: '#00D084',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        padding: 20,
    },
    stepContainer: {
        gap: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00D084',
        marginBottom: 10,
    },
    subtitle: {
        color: '#888',
        fontSize: 14,
        marginBottom: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: '#ccc',
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderRadius: 8,
        padding: 15,
        color: 'white',
        borderWidth: 1,
        borderColor: '#333',
        fontSize: 16,
    },
    nextButton: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        flex: 1,
        marginLeft: 10,
    },
    backStepButton: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        flex: 0.5,
        borderWidth: 1,
        borderColor: '#333',
    },
    backStepText: {
        color: '#888',
        fontSize: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 10,
    },
    typeOption: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#1E1E1E',
        borderWidth: 1,
        borderColor: '#333',
        alignItems: 'center',
    },
    typeSelected: {
        borderColor: '#00D084',
        backgroundColor: 'rgba(0, 208, 132, 0.1)',
    },
    typeText: {
        color: '#888',
        fontWeight: '600',
    },
    typeTextSelected: {
        color: '#00D084',
    },
    registerButton: {
        backgroundColor: '#00D084',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        flex: 2,
        marginLeft: 10,
    },
    disabledButton: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disclaimer: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    }
});
