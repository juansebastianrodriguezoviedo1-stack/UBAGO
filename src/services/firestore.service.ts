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
    serverTimestamp,
    orderBy,
    getDocs,
    getCountFromServer
} from 'firebase/firestore';
import { User, Ride, Restaurant, MenuItem, FoodOrder, CommissionEntry } from '../types';

export const FirestoreService = {
    // ==========================================
    // USERS (Drivers & Passengers)
    // ==========================================
    createUser: async (user: User) => {
        await setDoc(doc(db, 'users', user.uid), {
            ...user,
            isActive: true, // Default to active
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp()
        });
    },

    updateUserLogin: async (uid: string) => {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            isActive: true
        });
    },

    getActiveUsersCount: async (): Promise<number> => {
        const q = query(collection(db, 'users'), where('isActive', '==', true));
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
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

    updateUser: async (uid: string, data: Partial<User>) => {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, data);
    },

    // ==========================================
    // RIDES (Mobility)
    // ==========================================
    createRide: async (ride: Omit<Ride, 'id' | 'timestamp' | 'estado'>) => {
        const rideData = {
            ...ride,
            status: 'pending', // Default status
            estado: 'pending', // Legacy support
            timestamp: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'rides'), rideData);
        return docRef.id;
    },

    updateRideStatus: async (rideId: string, status: Ride['status'], driverId?: string) => {
        const rideRef = doc(db, 'rides', rideId);
        const updateData: any = {
            status: status,
            estado: status // Legacy sync
        };
        if (driverId) updateData.driverId = driverId;

        await updateDoc(rideRef, updateData);
    },

    listenToActiveRides: (callback: (rides: Ride[]) => void) => {
        const q = query(collection(db, 'rides'), where('status', '==', 'pending'));
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
    },

    // ==========================================
    // RESTAURANTS & FOOD
    // ==========================================
    registerRestaurant: async (restaurant: Omit<Restaurant, 'id' | 'isApproved'>) => {
        const newRest: any = {
            ...restaurant,
            isApproved: false, // Default requires admin approval
            status: 'closed',
            createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'restaurants'), newRest);
        return docRef.id;
    },

    getRestaurants: async (): Promise<Restaurant[]> => {
        const q = query(collection(db, 'restaurants'), where('isApproved', '==', true));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Restaurant));
    },

    createMenuItem: async (restaurantId: string, item: Omit<MenuItem, 'id'>) => {
        const menuRef = collection(db, 'restaurants', restaurantId, 'menu');
        await addDoc(menuRef, item);
    },

    getMenu: async (restaurantId: string): Promise<MenuItem[]> => {
        const menuRef = collection(db, 'restaurants', restaurantId, 'menu');
        const snapshot = await getDocs(menuRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
    },

    createFoodOrder: async (order: Omit<FoodOrder, 'id' | 'timestamp'>) => {
        const orderData = {
            ...order,
            status: 'new',
            timestamp: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'food_orders'), orderData);
        return docRef.id;
    },

    listenToFoodOrders: (userId: string, callback: (orders: FoodOrder[]) => void) => {
        const q = query(collection(db, 'food_orders'), where('userId', '==', userId), orderBy('timestamp', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FoodOrder));
            callback(orders);
        });
    },

    // ==========================================
    // COMMISSIONS & FINANCE
    // ==========================================
    recordCommission: async (entry: Omit<CommissionEntry, 'id' | 'createdAt'>) => {
        await addDoc(collection(db, 'commissions'), {
            ...entry,
            createdAt: serverTimestamp()
        });
    },

    getPendingCommissions: async (targetUid: string): Promise<number> => {
        const q = query(
            collection(db, 'commissions'),
            where('targetUid', '==', targetUid),
            where('status', '==', 'pending')
        );
        const snapshot = await getDocs(q);
        let total = 0;
        snapshot.forEach(doc => {
            total += doc.data().amount || 0;
        });
        return total;
    }
};
