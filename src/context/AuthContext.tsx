import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { FirestoreService } from '../services/firestore.service';
import { signInWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<void>;
    signInWithGoogle: (idToken: string) => Promise<void>;
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
                // Fetch full user data or CREATE if missing
                try {
                    const userData = await FirestoreService.getUser(firebaseUser.uid);
                    if (userData) {
                        await FirestoreService.updateUserLogin(firebaseUser.uid);
                        setUser({ ...userData, isActive: true });
                    } else {
                        // AUTO-REGISTER if missing (Critical Request: "Save everyone")
                        console.warn("User authenticated but no Firestore doc found. Creating now...");
                        const newUser: User = {
                            uid: firebaseUser.uid,
                            nombre: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
                            email: firebaseUser.email || '',
                            telefono: firebaseUser.phoneNumber || '',
                            role: 'passenger', // Default role for auto-registration
                            ubicacion_actual: { latitude: 5.3086, longitude: -73.8153 }, // Ubaté default center
                            isActive: true,
                            createdAt: new Date(),
                            lastLogin: new Date()
                        };
                        try {
                            await FirestoreService.createUser(newUser);
                            setUser(newUser);
                        } catch (createError) {
                            console.error("CRITICAL: Failed to auto-create user doc", createError);
                            setUser(null);
                        }
                    }
                } catch (e) {
                    console.error("Error fetching/creating user data:", e);
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

            throw error; // Re-throw to be handled by UI
        } finally {
            // Loading state will be set to false in onAuthStateChanged or here if error matches
            if (!user) setLoading(false);
        }
    };

    const signInWithGoogle = async (idToken: string) => {
        if (!idToken || typeof idToken !== 'string') {
            console.error("Invalid ID Token passed to signInWithGoogle");
            return;
        }
        setLoading(true);
        try {
            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential);
        } catch (error: any) {
            console.error("Google Sign-In Error:", error);
            // Handle specific firebase errors if needed
            throw error;
        } finally {
            // Loading state will be handled by onAuthStateChanged, but safety net:
            // We don't set loading false here immediately if successful because onAuthStateChanged triggers
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
            signInWithGoogle,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
