import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, StatusBar as RNStatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();

    const handleLogin = async () => {
        const cleanEmail = email.trim();
        const cleanPass = password.trim();

        if (!cleanEmail || !cleanPass) {
            alert("Por favor ingresa email y contraseña.");
            return;
        }

        try {
            await login(cleanEmail, cleanPass);
        } catch (error: any) {
            // Already handled in AuthContext mostly, but safety net
            console.log("Login screen catch:", error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoEmoji}>🚗</Text>
                    </View>
                    <Text style={styles.title}>UBAGO</Text>
                    <Text style={styles.subtitle}>Tu movilidad segura en Ubaté</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputIcon}>✉️</Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                                placeholder="usuario@ejemplo.com"
                                placeholderTextColor="#666"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>CONTRASEÑA</Text>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.inputIcon}>🔒</Text>
                            <TextInput
                                value={password}
                                onChangeText={setPassword}
                                style={styles.input}
                                placeholder="******"
                                placeholderTextColor="#666"
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        style={[styles.button, loading && styles.buttonDisabled]}
                    >
                        <Text style={styles.buttonText}>{loading ? 'Iniciando...' : 'INGRESAR'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.terms}>
                        ¿No tienes cuenta? <Text style={styles.link}>Regístrate</Text> (Próximamente)
                    </Text>
                    <Text style={styles.terms}>
                        Demo: demo@ubago.com / driver@ubago.com
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#00D084',

        // Shadow
        shadowColor: "#00D084",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    logoEmoji: {
        fontSize: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
        letterSpacing: -1,
    },
    titleAccent: {
        color: '#00D084',
    },
    subtitle: {
        color: '#888',
        marginTop: 8,
        fontSize: 14,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    form: {
        gap: 24,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        color: '#666',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333',
        height: 56,
        paddingHorizontal: 16,
    },
    inputIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#00D084',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,

        // Shadow
        shadowColor: "#00D084",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    terms: {
        textAlign: 'center',
        color: '#666',
        fontSize: 12,
        marginTop: 16,
    },
    link: {
        color: '#00D084',
        textDecorationLine: 'underline',
    },
});
