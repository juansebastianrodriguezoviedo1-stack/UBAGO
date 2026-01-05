import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyA_Xvx6JxnUKbvIf48ULVav1Uo0Ym2UZ7g",
    authDomain: "rideshare-ubate.firebaseapp.com",
    projectId: "rideshare-ubate",
    storageBucket: "rideshare-ubate.firebasestorage.app",
    messagingSenderId: "270078019676",
    appId: "1:270078019676:web:68c897980d8b896292be99",
    measurementId: "G-4TGDR5991G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
