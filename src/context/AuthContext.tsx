import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { FirestoreService } from '../services/firestore.service';
import { signInWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'; // Changed import
import { auth } from '../config/firebase';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<void>; // Changed signature
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// MOCK USER for Development if no real auth is active yet
/* const MOCK_USER: User = {
    uid: 'test_user_123',
    nombre: 'Usuario Prueba',
    telefono: '+573224158565',
    role: 'passenger',
    ubicacion_actual: { latitude: 5.3086, longitude: -73.8153 }
}; */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                // Fetch full user data
                try {
                    const userData = await FirestoreService.getUser(firebaseUser.uid);
                    if (userData) {
                        setUser(userData);
                    } else {
                        // Fallback for new users or missing docs (should be handled in registration)
                        console.warn("User authenticated but no Firestore doc found.");
                        setUser(null);
                    }
                } catch (e) {
                    console.error("Error fetching user data:", e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            // State update is handled by onAuthStateChanged
        } catch (error: any) {
            console.warn("Login Error:", error);

            if (error.code === 'auth/admin-restricted-operation' || error.code === 'auth/operation-not-allowed') {
                alert("⚠️ ERROR DE CONFIGURACIÓN FIREBASE:\n\nDebes habilitar 'Email/Password' en la Consola de Firebase -> Authentication -> Sign-in method.\n\nTambién revisa que no haya restricciones de Admin.");
            } else if (error.code === 'auth/invalid-email') {
                alert("⚠️ Email inválido. Verifica que no haya espacios extra.");
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                alert("⚠️ Credenciales incorrectas. Intenta de nuevo o verifica si el usuario existe.");
            }

            // DEMO FALLBACK if Auth fails (Strictly for development speed if blocked)
            // Remove this before production!
            if (email === 'demo@ubago.com') {
                console.log("Entering Demo Mode");
                setUser({
                    uid: 'demo_user_123',
                    nombre: 'Usuario Demo',
                    telefono: '0000000000',
                    role: 'passenger', // Default to passenger
                    ubicacion_actual: { latitude: 5.3086, longitude: -73.8153 }
                });
                setLoading(false);
                return;
            } else if (email === 'driver@ubago.com') {
                console.log("Entering Demo Driver Mode");
                setUser({
                    uid: 'demo_driver_123',
                    nombre: 'Conductor Demo',
                    telefono: '0000000000',
                    role: 'driver',
                    ubicacion_actual: { latitude: 5.3086, longitude: -73.8153 }
                });
                setLoading(false);
                return;
            }

            throw error; // Re-throw to be handled by UI
        } finally {
            // Loading state will be set to false in onAuthStateChanged or here if error matches
            if (!user) setLoading(false);
        }
    };

    const logout = () => {
        auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
