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
    isActive?: boolean;
    lastLogin?: any;
    createdAt?: any;
    vehiculo?: {
        tipo: 'moto' | 'carro' | 'camioneta';
        placa: string;
        modelo: string;
        color: string;
    };
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
    status?: RideStatus; // Legacy support alias
    tipoVehiculo: 'moto' | 'carro' | 'camioneta';
    timestamp: any; // Firestore Timestamp
    ruta?: string; // Polyline string
    driverId?: string; // Optional alias for conductorId
}

export interface Rating {
    id: string;
    de_uid: string;
    hacia_uid: string;
    calificacion: number;
    comentario?: string;
    timestamp: any;
}

// FOOD & DELIVERY TYPES
export interface Restaurant {
    id: string;
    name: string;
    image?: string;
    rating?: number;
    deliveryTime?: string;
    deliveryFee?: number;
    tags?: string[];
    isApproved: boolean;
    status?: 'open' | 'closed';
    createdAt?: any;
    // Extended properties for registration
    ownerUid?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    category?: string[];
    preparationTimeMin?: number;
    commissionRate?: number;
    bankAccount?: {
        type: 'nequi' | 'bancolombia';
        number: string;
        holderName: string;
    };
    logoUrl?: string;
    bannerUrl?: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    category?: string;
}

export interface CartItem extends MenuItem {
    quantity: number;
    instructions?: string;
}

export interface FoodOrder {
    id: string;
    userId: string;
    restaurantId: string;
    items: CartItem[];
    total: number;
    status: 'new' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'cancelled';
    timestamp: any;
    address: string;
    location?: {
        latitude: number;
        longitude: number;
    };
}

export interface CommissionEntry {
    id: string;
    targetUid: string; // The user (driver/restaurant) paying the commission
    amount: number;
    description: string; // e.g., "Commission for Ride #123"
    status: 'pending' | 'paid';
    createdAt: any;
    sourceId?: string; // Ride ID or Order ID
}
