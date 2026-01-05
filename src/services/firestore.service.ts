import { db } from '../config/firebase';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { User, Ride, UserRole } from '../types';

export const FirestoreService = {
    // Users
    createUser: async (user: User) => {
        await setDoc(doc(db, 'users', user.uid), user);
    },

    getUser: async (uid: string): Promise<User | null> => {
        const docRef = await getDoc(doc(db, 'users', uid));
        if (docRef.exists()) {
            return docRef.data() as User;
        }
        return null;
    },

    updateUserLocation: async (uid: string, location: { latitude: number; longitude: number }) => {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { ubicacion_actual: location });
    },

    // Rides
    createRide: async (ride: Omit<Ride, 'id' | 'timestamp' | 'estado'>) => {
        const rideData = {
            ...ride,
            estado: 'pending',
            timestamp: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'rides'), rideData);
        return docRef.id;
    },

    updateRideStatus: async (rideId: string, status: Ride['estado'], driverId?: string) => {
        const rideRef = doc(db, 'rides', rideId);
        const updateData: any = { estado: status };
        if (driverId) updateData.conductorId = driverId;

        await updateDoc(rideRef, updateData);
    },

    // Listeners
    listenToActiveRides: (callback: (rides: Ride[]) => void) => {
        const q = query(collection(db, 'rides'), where('estado', '==', 'pending'));
        return onSnapshot(q, (snapshot) => {
            const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ride));
            callback(rides);
        });
    },

    listenToRideUpdates: (rideId: string, callback: (ride: Ride) => void) => {
        return onSnapshot(doc(db, 'rides', rideId), (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...doc.data() } as Ride);
            }
        });
    }
};
