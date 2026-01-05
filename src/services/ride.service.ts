import { collection, addDoc, onSnapshot, query, where, updateDoc, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

const RIDES_COLLECTION = 'rides';

export interface RideRequest {
    id?: string;
    rider_id: string; // Phone number or User ID
    origin: string;
    destination: string;
    vehicle_type: 'moto' | 'carro' | 'camioneta';
    offer_price: number;
    status: 'pending' | 'negotiating' | 'accepted' | 'in_progress' | 'completed';
    created_at: any;
}

export const RideService = {
    // Create a new ride request
    createRequest: async (data: Omit<RideRequest, 'id' | 'created_at' | 'status'>) => {
        try {
            // DEMO MODE CHECK
            if (data.rider_id === 'mock_user_fallback' || data.rider_id.startsWith('test_')) {
                console.warn('⚠️ RideService: Demo Mode Active. Simulating Ride Creation.');
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                return 'mock_ride_id_' + Date.now();
            }

            const docRef = await addDoc(collection(db, RIDES_COLLECTION), {
                ...data,
                status: 'pending',
                created_at: serverTimestamp(),
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating ride request:", error);
            throw error;
        }
    },

    // Listen for available rides (Driver view)
    subscribeToAvailableRides: (callback: (rides: RideRequest[]) => void) => {
        const q = query(
            collection(db, RIDES_COLLECTION),
            where('status', '==', 'pending'),
            orderBy('created_at', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const rides = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as RideRequest[];
            callback(rides);
        }, (error) => {
            // If permission denied in Demo Mode, return empty list or mock data
            console.warn("Snapshot Error (Likely Permissions):", error);
            if (error.code === 'permission-denied') {
                callback([]); // Return empty list to avoid crash
            }
        });
    },

    // Listen to a specific ride (Rider view)
    subscribeToRide: (rideId: string, callback: (ride: RideRequest) => void) => {
        if (rideId.startsWith('mock_ride_id')) {
            // Mock subscription for demo ride
            console.log("Subscribing to Mock Ride");
            callback({
                id: rideId,
                rider_id: 'mock_user_fallback',
                origin: 'Ubicación Demo',
                destination: 'Destino Demo',
                vehicle_type: 'moto',
                offer_price: 5000,
                status: 'searching_driver', // Custom status
                created_at: new Date()
            } as any);
            return () => { };
        }

        return onSnapshot(doc(db, RIDES_COLLECTION, rideId), (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...doc.data() } as RideRequest);
            }
        });
    },

    // Accept a ride
    acceptRide: async (rideId: string, driverId: string) => {
        if (rideId.startsWith('mock_ride_id')) return;

        const rideRef = doc(db, RIDES_COLLECTION, rideId);
        await updateDoc(rideRef, {
            status: 'accepted',
            driver_id: driverId,
            accepted_at: serverTimestamp()
        });
    }
};
