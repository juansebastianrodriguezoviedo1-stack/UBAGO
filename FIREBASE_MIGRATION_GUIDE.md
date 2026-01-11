# Guia de Migracion - De Logica Simulada a Firebase Real

## FoodCheckoutScreen.tsx

### CAMBIO REQUERIDO: Reemplazar setTimeout() con Firestore real

**Ubicacion Actual**: `/src/screens/food/FoodCheckoutScreen.tsx`
**Lineas Problematicas**: 19-24

### ANTES (Simulado):
```typescript
const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate Order API Logic
    setTimeout(() => {
        setLoading(false);
        navigation.navigate('FoodOrderTracking' as never);
    }, 2000);
};
```

### DESPUES (Real):
```typescript
const handlePlaceOrder = async () => {
    try {
        setLoading(true);
        
        // 1. Crear orden en Firestore
        const orderId = doc(collection(db, 'orders')).id;
        const orderData = {
            orderId,
            userId: auth.currentUser?.uid,
            items: cartItems,
            totalAmount: totalPrice,
            status: 'pending_payment',
            createdAt: new Date(),
            restaurantId: selectedRestaurant,
            deliveryAddress: userAddress,
        };
        
        await setDoc(doc(db, 'orders', orderId), orderData);
        
        // 2. Navegar a tracking
        navigation.navigate('FoodOrderTracking', { orderId });
        
    } catch (error) {
        console.error('Order error:', error);
        Alert.alert('Error', 'No se pudo procesar la orden');
    } finally {
        setLoading(false);
    }
};
```

## Imports Necesarios
Añade estos imports en FoodCheckoutScreen.tsx:
```typescript
import { db, auth } from '../config/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
```

## Pasos de Implementacion

1. Abre FoodCheckoutScreen.tsx
2. Reemplaza la funcion handlePlaceOrder completa
3. Añade los imports de Firebase
4. Guarda y commit los cambios
5. Repite para DriverTripsScreen

## Firestore Collection Structure

Crear esta estructura en Firebase:
```
ordes/
  {orderId}/
    orderId: string
    userId: string
    items: array
    totalAmount: number
    status: string
    createdAt: timestamp
    restaurantId: string
    deliveryAddress: object
```

## Testing

Antesdespues de deploying:
1. Verificar que la orden se crea en Firestore
2. Verificar que el tracking funciona
3. Validar timestamps y campos
