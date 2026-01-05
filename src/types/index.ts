export type UserRole = 'passenger' | 'driver';

export interface User {
    uid: string;
    nombre: string;
    telefono: string;
    role: UserRole;
    email?: string; // Added email field
    calificacion?: number;
    foto?: string;
    ubicacion_actual?: {
        latitude: number;
        longitude: number;
    };
    fcmToken?: string;
}

export interface Vehicle {
    id: string;
    conductorId: string;
    tipo: 'moto' | 'carro' | 'camioneta';
    placa: string;
    modelo: string;
    color: string;
    calificacion?: number;
}

export type RideStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface Ride {
    id: string;
    conductorId?: string;
    pasajeroId: string;
    origen: {
        address: string;
        latitude: number;
        longitude: number;
    };
    destino: {
        address: string;
        latitude: number;
        longitude: number;
    };
    tarifa: number;
    estado: RideStatus;
    tipoVehiculo: 'moto' | 'carro' | 'camioneta';
    timestamp: any; // Firestore Timestamp
    ruta?: string; // Polyline string
}

export interface Rating {
    id: string;
    de_uid: string;
    hacia_uid: string;
    calificacion: number;
    comentario?: string;
    timestamp: any;
}
