import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function Perfil() {
    const { logout, user } = useAuth();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarEmoji}>👤</Text>
                    </View>
                    <Text style={styles.name}>{user?.nombre || 'Usuario'}</Text>
                    {/* Email Display */}
                    <Text style={[styles.phone, { marginBottom: 4, color: '#00D084' }]}>{user?.email || 'usuario@ubago.com'}</Text>

                    {/* Editable Phone */}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.phone}>{user?.telefono || 'Sin teléfono'}</Text>
                        <TouchableOpacity style={styles.editIcon} onPress={() => alert("Editar teléfono próximamente")}>
                            <Text style={{ fontSize: 12 }}>✏️</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Options */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionIcon}>💳</Text>
                        <Text style={styles.optionText}>Métodos de Pago</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionIcon}>🛡️</Text>
                        <Text style={styles.optionText}>Seguridad</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Text style={styles.optionIcon}>⚙️</Text>
                        <Text style={styles.optionText}>Configuración</Text>
                    </TouchableOpacity>

                    {user?.role === 'passenger' && (
                        <TouchableOpacity
                            style={[styles.option, { borderColor: '#00D084', backgroundColor: 'rgba(0, 208, 132, 0.1)' }]}
                            onPress={() => alert("Próximamente: Flujo para registrar vehículo.")}
                        >
                            <Text style={styles.optionIcon}>🚕</Text>
                            <Text style={[styles.optionText, { color: '#00D084' }]}>Convertirme en Conductor</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    scroll: { padding: 24, alignItems: 'center' },
    header: { alignItems: 'center', marginBottom: 40, marginTop: 40 },
    avatarContainer: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: '#1a1a1a',
        alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        borderWidth: 2, borderColor: '#00D084'
    },
    avatarEmoji: { fontSize: 50 },
    name: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
    phone: { fontSize: 16, color: '#888' },
    section: { width: '100%', marginBottom: 40, gap: 12 },
    option: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#1E1E1E', padding: 16, borderRadius: 12,
        borderWidth: 1, borderColor: '#333'
    },
    optionIcon: { fontSize: 20, marginRight: 16 },
    optionText: { color: 'white', fontSize: 16, fontWeight: '500' },
    logoutButton: {
        backgroundColor: '#2a1a1a', paddingVertical: 16, paddingHorizontal: 32,
        borderRadius: 12, borderWidth: 1, borderColor: '#ff4444', width: '100%', alignItems: 'center'
    },
    logoutText: { color: '#ff4444', fontWeight: 'bold', fontSize: 16 },
    editIcon: { marginLeft: 8, backgroundColor: '#333', padding: 4, borderRadius: 8 }
});
