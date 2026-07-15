/**
 * UBAGO - Wompi Webhook & Payment Simulator
 * 
 * Este script simula el comportamiento de los servidores de Wompi al reportar
 * un pago aprobado. Dado que la aplicación móvil corre localmente, este script
 * actualiza directamente el estado del pedido en Firestore a través de la API REST.
 * 
 * Uso:
 * 1. Ejecutar localmente con Node:
 *    node scratch/wompi_webhook_simulator.js <REFERENCIA_ORDEN>
 * 
 * Ejemplo:
 *    node scratch/wompi_webhook_simulator.js UBAGO-ORD-1716938291000
 */

const https = require('https');

// Obtener la referencia por argumento CLI
const orderReference = process.argv[2];

if (!orderReference) {
  console.log('\x1b[31m%s\x1b[0m', '❌ Error: Debes proporcionar una referencia de orden.');
  console.log('Uso: node scratch/wompi_webhook_simulator.js UBAGO-ORD-XXXXXXXXXXXXXXXX');
  process.exit(1);
}

// Configuración de Firebase (Cargada desde el .env del proyecto)
const PROJECT_ID = 'rideshare-ubate'; 
const COLLECTION_NAME = 'food_orders';

console.log(`\n🚀 \x1b[36mIniciando simulación de pago para la referencia:\x1b[0m \x1b[1m${orderReference}\x1b[0m`);

// Paso 1: Buscar la orden en Firestore con esa referencia
function findOrderByReference(reference) {
  const postData = JSON.stringify({
    structuredQuery: {
      from: [{ collectionId: COLLECTION_NAME }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'paymentReference' },
          op: 'EQUAL',
          value: { stringValue: reference }
        }
      },
      limit: 1
    }
  });

  const options = {
    hostname: 'firestore.googleapis.com',
    port: 443,
    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents:runQuery`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response && response.length > 0 && response[0].document) {
            resolve(response[0].document);
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

// Paso 2: Actualizar el estado de la orden a 'new' o 'preparing' (pago aprobado)
function updateOrderStatus(documentName, newStatus) {
  // Extraer el ID relativo del documento (projects/projectId/databases/(default)/documents/collection/docId)
  const relativePath = documentName.substring(documentName.indexOf('/databases/(default)/documents/') + 30);
  
  const patchData = JSON.stringify({
    fields: {
      status: { stringValue: newStatus }
    }
  });

  // Wompi notificará que el estado es APPROVED, por lo que marcamos la orden como pagada y nueva
  const options = {
    hostname: 'firestore.googleapis.com',
    port: 443,
    path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${relativePath}?updateMask.fieldPaths=status`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(patchData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(patchData);
    req.end();
  });
}

// Flujo de ejecución
findOrderByReference(orderReference)
  .then((document) => {
    if (!document) {
      console.log('\x1b[31m%s\x1b[0m', `❌ No se encontró ninguna orden en Firestore con la referencia ${orderReference}`);
      process.exit(1);
    }

    const docName = document.name;
    const currentStatus = document.fields.status.stringValue;

    console.log(`✅ Orden encontrada. Estado actual en Firestore: \x1b[33m${currentStatus}\x1b[0m`);

    if (currentStatus !== 'pending_payment') {
      console.log('\x1b[33m%s\x1b[0m', `⚠️ Nota: El estado actual no es 'pending_payment'. Se forzará la actualización de todas formas.`);
    }

    console.log('🔄 Enviando señal de simulación de pago aprobado a Firestore...');
    return updateOrderStatus(docName, 'preparing');
  })
  .then((result) => {
    console.log('\x1b[32m%s\x1b[0m', '🎉 ¡ÉXITO! Transacción simulada aprobada en Wompi.');
    console.log(`📱 El estado del pedido se ha actualizado a: \x1b[32mpreparing\x1b[0m`);
    console.log('La aplicación móvil reflejará el cambio en tiempo real a través de los listeners de Firebase.');
  })
  .catch((err) => {
    console.error('❌ Ocurrió un error durante la simulación:', err);
  });
