# Checklist de Implementacion UBAGO v1.0.0

## FASE 1: Preparacion Local (EN LOCAL - PowerShell)

[ ] Abrir PowerShell en tu maquina
[ ] Navegar a proyecto: cd d:\SEBAS\ESTUDIO\APP DE TRANSPORTE\UBAGO
[ ] Ejecutar: npm install
[ ] Ejecutar: npm run build
[ ] Ejecutar: git status (ver cambios)
[ ] Ejecutar: git pull origin main (descargar cambios nuevos)

## FASE 2: Conectar FoodCheckoutScreen (EN VS CODE LOCAL)

[ ] Abrir src/screens/food/FoodCheckoutScreen.tsx
[ ] Leer FIREBASE_MIGRATION_GUIDE.md de referencia
[ ] Reemplazar handlePlaceOrder segun la guia
[ ] Añadir imports: db, auth, collection, doc, setDoc
[ ] Guardar archivo
[ ] Verificar que no hay errores en console

## FASE 3: Conectar DriverTripsScreen (EN VS CODE LOCAL)

[ ] Abrir src/screens/driver/DriverTripsScreen.tsx
[ ] Reemplazar setTimeout con logica real de Firestore
[ ] Añadir listeners de Firestore para updates en tiempo real
[ ] Guardar archivo

## FASE 4: Firestore Setup (EN FIREBASE CONSOLE)

[ ] Ir a https://console.firebase.google.com
[ ] Seleccionar proyecto "rideshare-ubate"
[ ] En Firestore, crear collection "orders"
[ ] En Firestore, crear collection "trips"
[ ] Configurar reglas de seguridad para auth users

## FASE 5: Testing (EN EMULADOR O DEVICE)

[ ] npm start para iniciar Expo
[ ] Probar flow completo de Food Order
[ ] Verificar en Firestore que se crea documento
[ ] Probar flow completo de Driver Trip
[ ] Verificar en Firestore que se crea documento
[ ] Verificar timestamps y campos
[ ] Revisar console.log para errores

## FASE 6: Commit y Push (EN PowerShell)

[ ] git add . (agregar archivos modificados)
[ ] git commit -m "feat: Conectar FoodCheckoutScreen y DriverTripsScreen a Firebase real"
[ ] git push origin main
[ ] Verificar en GitHub que los cambios aparecen

## FASE 7: Crear Release (EN GitHub)

[ ] Ir a https://github.com/juansebastianrodriguezoviedo1-stack/UBAGO
[ ] Crear nuevo release v1.0.1-firebase
[ ] Descripcion: "Firebase real integration - FoodCheckout y DriverTrips"
[ ] Marcar como "latest release"

---

## Tiempo Estimado:
- Fase 1: 5 minutos
- Fase 2: 15 minutos
- Fase 3: 15 minutos
- Fase 4: 10 minutos
- Fase 5: 20 minutos
- Fase 6: 5 minutos
- Fase 7: 5 minutos

TOTAL: ~75 minutos (1.5 horas)

## Soporte:
Si tienes errores, revisa:
1. FIREBASE_MIGRATION_GUIDE.md
2. task.md para blockers
3. Console errors en Expo
4. Firestore rules configuradas correctamente
