import React, { createContext, useContext, useState, ReactNode } from 'react';

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    restaurantId: string;
    extras?: string;
};

type FoodCartContextType = {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    restaurantId: string | null;
    total: number;
};

const FoodCartContext = createContext<FoodCartContextType | undefined>(undefined);

export const FoodCartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    const addToCart = (newItem: CartItem) => {
        // If adding from a different restaurant, confirm clear (for now just clear or separate logic)
        if (restaurantId && restaurantId !== newItem.restaurantId) {
            // Simple logic: clear previous if different restaurant
            setItems([newItem]);
            setRestaurantId(newItem.restaurantId);
            return;
        }

        setRestaurantId(newItem.restaurantId);

        setItems(prev => {
            const existing = prev.find(i => i.id === newItem.id);
            if (existing) {
                return prev.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i);
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        if (items.length === 1) setRestaurantId(null);
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const clearCart = () => {
        setItems([]);
        setRestaurantId(null);
    };

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <FoodCartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, restaurantId, total }}>
            {children}
        </FoodCartContext.Provider>
    );
};

export const useFoodCart = () => {
    const context = useContext(FoodCartContext);
    if (!context) throw new Error('useFoodCart must be used within a FoodCartProvider');
    return context;
};
