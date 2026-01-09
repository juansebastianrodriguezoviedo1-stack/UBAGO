# 🚀 UBAGO Quick Start - Desde Cero a Dinero en 30 Minutos

**Nivel de Dificultad:** Principiante  
**Tiempo Total:** 30 minutos  
**Resultado Final:** App generando comisiones

---

## ⚡ PASO 1: Setup Stripe (5 minutos)

### 1.1 Crear Cuenta Stripe
```
✅ Ve a: https://dashboard.stripe.com/register
✅ Regístrate con email: juansebastianrodriguezoviedo1@gmail.com
✅ Completa verificación
```

### 1.2 Obtener API Keys
```
✅ Dashboard → Developers → API Keys
✅ Copia:
   - Publishable Key: pk_live_...
   - Secret Key: sk_live_...
   
⚠️  GUARDA ESTOS VALORES EN UN LUGAR SEGURO
```

---

## ⚙️ PASO 2: Configurar Ambiente (5 minutos)

### 2.1 Crear archivo .env
```bash
# En la raíz del proyecto UBAGO:
cp .env.example .env
```

### 2.2 Editar .env con tus valores
```bash
# Abre el archivo .env con tu editor preferido:
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_tu_key_aqui
STRIPE_SECRET_KEY=sk_live_tu_secret_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook

# Deja el resto igual (comisiones ya están en 25% y 30%)
```

---

## 💻 PASO 3: Instalación (5 minutos)

```bash
# En tu máquina local:
cd UBAGO
npm install

# Instala stripe:
npm install @stripe/stripe-js
npm install stripe
```

---

## 🏃 PASO 4: Ejecutar en Desarrollo (5 minutos)

```bash
# Iniciar Expo:
npm start

# En otra terminal, ir a la raíz del proyecto
# y ejecutar:
npm run ios    # Para iPhone simulator
# o
npm run android # Para Android emulator
```

---

## 🧪 PASO 5: Testear Pagos (5 minutos)

### En tu app (en el simulator):

1. **Para Comida:**
   - Ve a FoodHomeScreen
   - Selecciona un restaurante
   - Agrega items al carrito
   - Click en "Pagar"
   - App llama a `StripeService.createFoodPaymentIntent()`
   - Ingresa tarjeta de prueba: `4242 4242 4242 4242`
   - Cualquier fecha futura, cualquier CVC
   - **✅ Pago procesado! UBAGO toma 30%**

2. **Para Viajes:**
   - Ve a pantalla de viaje completado
   - Click en "Pagar viaje"
   - Ingresa tarjeta de prueba
   - **✅ Viaje pagado! UBAGO toma 25%**

---

## 📊 PASO 6: Monitorear Ganancias (Inmediato)

### En Stripe Dashboard:
```
✅ Ve a: https://dashboard.stripe.com
✅ Sección "Payments"
✅ Verás todas tus transacciones
✅ Sección "Balances" muestra dinero disponible para retirar
```

---

## 🎉 PASO 7: Publicar en Producción

Cuando estés listo para dinero real:

### 7.1 Cambiar a LIVE Keys
```bash
# En .env, reemplaza con tus LIVE keys (no test):
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_TUCLAVEREAL
STRIPE_SECRET_KEY=sk_live_TUSECRETOREAL
```

### 7.2 Build for iOS
```bash
eas build --platform ios
# Esto crea un archivo .ipa para enviar a App Store
```

### 7.3 Build for Android
```bash
eas build --platform android
# Esto crea un APK/AAB para enviar a Google Play
```

### 7.4 Submit a Stores
```bash
# iOS
eas submit --platform ios

# Android  
eas submit --platform android
```

---

## 💰 RECIBIRÁS:

### Desde el primer día:
```
✅ Transacciones en tiempo real
✅ Dinero acumulándose en Stripe
✅ Dashboard para monitorear

💵 Cada viaje ($15 promedio):
   - Cliente paga: $15
   - UBAGO gana: $3.75 (25%)
   - Conductor recibe: $11.25

🍔 Cada orden ($20 promedio):
   - Cliente paga: $20
   - UBAGO gana: $6.00 (30%)
   - Restaurante recibe: $14.00
```

---

## 🔒 SEGURIDAD - IMPORTANTE

```
⚠️  NUNCA:
- Commitees .env a GitHub
- Compartas tus SECRET keys
- Hardcodees credenciales

✅ SIEMPRE:
- Usa variables de entorno
- Rota keys regularmente
- Usa HTTPS en producción
- Activa 2FA en Stripe
```

---

## ❓ TROUBLESHOOTING

### "Payment failed: Invalid API Key"
- ✅ Verifica que tus keys en .env sean correctas
- ✅ Asegúrate de usar LIVE keys en producción
- ✅ Revisa que no haya espacios extras

### "Module not found: @stripe/stripe-js"
- ✅ Corre: `npm install @stripe/stripe-js`
- ✅ Reinicia Expo: Ctrl+C y luego `npm start`

### "Transaction not found in Firestore"
- ✅ Verifica que Firestore esté configurado
- ✅ Revisa Firebase Console → Firestore

---

## 📞 SOPORTE RÁPIDO

**Documentación Completa:** `MONETIZATION_GUIDE.md`  
**Código de Pagos:** `src/services/stripe.service.ts`  
**Configuración:** `.env.example`

---

**Listo!** 🎊  
Ya tienes UBAGO generando dinero.

¿Preguntas? Revisa MONETIZATION_GUIDE.md o README.md
