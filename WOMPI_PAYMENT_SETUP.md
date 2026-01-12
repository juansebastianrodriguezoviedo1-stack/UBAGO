# Solución de Pagos para UBAGO - Wompi (Sin RUT requerido en desarrollo)

## Problema
Ubago usa Stripe para pagos, pero Stripe requiere RUT (Registro Único Tributario) para Colombia, que no tienes aún.

## Solución: Wompi - Gateway de pagos colombiano

Wompi es la alternativa perfecta para pagos en Colombia porque:
- ✅ No requiere RUT para desarrollo/testing
- ✅ Soporta tarjetas débito/crédito
- ✅ Soporta billetera digital (Nequi, Daviplata)
- ✅ Integración sencilla con React Native
- ✅ Comisiones competitivas (1.5% - 3%)
- ✅ Documentación excelente

## Integración rápida (30 minutos)

### 1. Registrate en Wompi
https://dashboard.wompi.co/auth/login

### 2. Obtén tus credenciales
- API Key (para producción)
- Public Key (para frontend)
- Webhook Secret (para confirmaciones)

### 3. Instala el SDK
```bash
npm install @wompi/payment-sdk
```

### 4. Actualiza .env
```
WOMPI_PUBLIC_KEY=your_public_key
WOMPI_API_KEY=your_api_key
WOMPI_WEBHOOK_SECRET=your_secret
```

### 5. Reemplaza el código de pago

En `src/services/payment.service.ts`, reemplaza Stripe con Wompi:

```typescript
import { WompiPaymentLink } from '@wompi/payment-sdk';

export const createWompiTransaction = async (amountInCents: number, orderData: any) => {
  const response = await fetch('https://api.wompi.co/v1/transactions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WOMPI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount_in_cents: amountInCents,
      currency: 'COP',
      customer_email: orderData.userEmail,
      reference: orderData.orderId,
      redirect_url: 'ubago://payment-result'
    })
  });
  
  return response.json();
};
```

### 6. Actualiza FoodCheckoutScreen

En `src/screens/food/FoodCheckoutScreen.tsx`:

```typescript
import { createWompiTransaction } from '../../services/payment.service';

const handlePlaceOrder = async () => {
  try {
    const { transaction_id } = await createWompiTransaction(
      totalAmount * 100,
      orderData
    );
    
    // Guardar order en Firebase
    await createFoodOrder({
      ...orderData,
      paymentId: transaction_id,
      paymentMethod: 'wompi',
      status: 'pending_payment'
    });
    
  } catch (error) {
    console.error('Payment error:', error);
  }
};
```

## Estado actual
- ✅ FoodCheckoutScreen conectado a Firebase
- ✅ DriverTripsScreen conectado a Firebase
- ✅ Autenticación Firebase funcional
- ✅ Firestore CRUD completo
- ⏳ Pagos listos para Wompi (Stripe sigue como opción para RUT)

## Próximos pasos
1. Crear cuenta en Wompi
2. Actualizar variables de entorno
3. Actualizar payment.service.ts con Wompi
4. Testear transacciones en staging
5. Pasar a producción

## Contacto Wompi
- Docs: https://docs.wompi.co
- Email: soporte@wompi.co
- Chat: https://wompi.com/es/co/contacto

