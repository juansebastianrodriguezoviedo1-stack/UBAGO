import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ride } from '../types';
import { FirestoreService } from '../services/firestore.service';
import { useAuth } from './AuthContext';

interface RideContextType {
    currentRide: Ride | null;
    availableRides: Ride[];
    createRideRequest: (ride: Omit<Ride, 'id' | 'timestamp' | 'estado'>) => Promise<void>;
    acceptRide: (rideId: string) => Promise<void>;
    finishRide: () => void;
}

const RideContext = createContext<RideContextType>({} as RideContextType);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [currentRide, setCurrentRide] = useState<Ride | null>(null);
    const [availableRides, setAvailableRides] = useState<Ride[]>([]);

    // Driver Listeners
    useEffect(() => {
        if (user?.rol === 'driver') {
            const unsubscribe = FirestoreService.listenToActiveRides((rides) => {
                setAvailableRides(rides);
            });
            return () => unsubscribe();
        }
    }, [user]);

    // Passenger/Active Ride Listeners
    useEffect(() => {
        if (currentRide?.id) {
            const unsubscribe = FirestoreService.listenToRideUpdates(currentRide.id, (updatedRide) => {
                setCurrentRide(updatedRide);
            });
            return () => unsubscribe();
        }
    }, [currentRide?.id]);

    const createRideRequest = async (rideData: Omit<Ride, 'id' | 'timestamp' | 'estado'>) => {
        const rideId = await FirestoreService.createRide(rideData);
        setCurrentRide({ ...rideData, id: rideId, estado: 'pending', timestamp: null });
    };

    const acceptRide = async (rideId: string) => {
        if (!user) return;
        await FirestoreService.updateRideStatus(rideId, 'accepted', user.uid);
        // Optimistically update or wait for listener
    };

    const finishRide = () => {
        setCurrentRide(null);
    };

    return (
        <RideContext.Provider value={{
            currentRide,
            availableRides,
            createRideRequest,
            acceptRide,
            finishRide
        }}>
            {children}
        </RideContext.Provider>
    );
};

export const useRide = () => useContext(RideContext);
