import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, StatusBar as RNStatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// TODO: REPLACE THESE WITH YOUR ACTUAL CLIENT IDS FROM GOOGLE CLOUD CONSOLE
// https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_IDS = {
    web: '270078019676-geincph1lvrine2malqqQme12ufc2p4m.apps.googleusercontent.com',
    android: '270078019676-c4g1pmo3he60308auq91cj5e81rb746o.apps.googleusercontent.com',
    ios: '270078019676-aqjvdftmqteg8intmp0a8aqih6dkqotm.apps.googleusercontent.com',
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, signInWithGoogle, loading } = useAuth();

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_CLIENT_IDS.web,
        iosClientId: GOOGLE_CLIENT_IDS.ios,
        androidClientId: GOOGLE_CLIENT_IDS.android,
        redirectUri: 'ubago://oauth',
        scopes: ['profile', 'email'],
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            if (id_token) {
                // Prevent crash if signInWithGoogle fails internally
                signInWithGoogle(id_token).catch(err => {
                    console.error("Google Sign In Wrapper Error:", err);
                    alert("Error iniciando sesión con Google. Intenta de nuevo.");
                });
            }
        } else if (response?.type === 'error') {
            console.error("Google Auth Session Error:", response.error);
            alert("Error en la conexión con Google.");
        }
    }, [response]);

    const handleGoogleLogin = async () => {
        try {
            await promptAsync();
            // Auth flow is handled by the useEffect(response) hook which is more reliable for native redirects
        } catch (e) {
            console.error("Google login error:", e);
        }
    };

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

                    <TouchableOpacity
                        onPress={() => handleGoogleLogin()}
                        disabled={!request || loading}
                        style={[styles.googleButton, loading && styles.buttonDisabled]}
                    >
                        <Text style={styles.googleButtonText}>INGRESAR CON GOOGLE</Text>
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
    googleButton: {
        backgroundColor: '#fff',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    googleButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});
