import React, { createContext, useContext, useState, useEffect } from 'react';
import { LocationService } from '../services/location.service';

interface LocationContextType {
    location: { latitude: number; longitude: number } | null;
    hasPermission: boolean | null;
    getCurrentLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType>({} as LocationContextType);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        (async () => {
            const granted = await LocationService.requestPermissions();
            setHasPermission(granted);
            if (granted) {
                const loc = await LocationService.getCurrentLocation();
                setLocation(loc);
            }
        })();
    }, []);

    const getCurrentLocation = async () => {
        const loc = await LocationService.getCurrentLocation();
        setLocation(loc);
    };

    return (
        <LocationContext.Provider value={{ location, hasPermission, getCurrentLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
