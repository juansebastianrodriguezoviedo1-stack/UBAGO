interface WompiTransactionParams {
  amountInCents: number;
  email: string;
  reference: string;
  paymentMethod?: {
    type: 'CARD' | 'NEQUI' | 'PSE';
    [key: string]: any;
  };
}

interface CommissionConfig {
  driverCommissionRate: number; // 0.25 = 25%
  restaurantCommissionRate: number; // 0.30 = 30%
  processingFee: number; // Wompi rate (e.g. 2.65% + $700 COP)
}

const WOMPI_SANDBOX_URL = 'https://sandbox.wompi.co/v1';
const WOMPI_PRODUCTION_URL = 'https://api.wompi.co/v1';

const isProduction = process.env.EXPO_PUBLIC_ENVIRONMENT === 'production';
const WOMPI_BASE_URL = isProduction ? WOMPI_PRODUCTION_URL : WOMPI_SANDBOX_URL;
const WOMPI_PUBLIC_KEY = process.env.EXPO_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_sandbox_dummy_key';

export const PaymentService = {
  // Configuración de comisiones de la plataforma UBAGO
  commissionConfig: {
    driverCommissionRate: 0.25, // UBAGO toma 25% de cada viaje
    restaurantCommissionRate: 0.30, // UBAGO toma 30% de cada orden de comida
    processingFee: 0.0265, // Wompi + 2.65% tarifa aproximada
  } as CommissionConfig,

  /**
   * Crea una transacción en Wompi (Sandbox / Producción)
   */
  createWompiTransaction: async (params: WompiTransactionParams) => {
    try {
      // Wompi requiere aceptación previa de términos antes de transaccionar directamente
      const merchantsRes = await fetch(`${WOMPI_BASE_URL}/merchants/${WOMPI_PUBLIC_KEY}`);
      if (!merchantsRes.ok) {
        throw new Error(`Failed to load merchant: ${merchantsRes.statusText}`);
      }
      const merchantsData = await merchantsRes.json();
      const acceptanceToken = merchantsData.data.presigned_acceptance.acceptance_token;

      // Crear la transacción
      const response = await fetch(`${WOMPI_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WOMPI_PUBLIC_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount_in_cents: params.amountInCents,
          currency: 'COP',
          customer_email: params.email,
          reference: params.reference,
          payment_method: params.paymentMethod || {
            type: 'CARD', // Por defecto usamos tarjeta
          },
          acceptance_token: acceptanceToken,
          redirect_url: 'ubago://payment-result'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.reason || `Transaction failed: ${response.statusText}`);
      }

      const resData = await response.json();
      return resData.data;
    } catch (error: any) {
      console.error('Error creating Wompi transaction:', error.message);
      throw error;
    }
  },

  /**
   * Obtiene el estado de una transacción usando su ID de Wompi
   */
  checkWompiTransactionStatus: async (transactionId: string) => {
    try {
      const response = await fetch(`${WOMPI_BASE_URL}/transactions/${transactionId}`);
      if (!response.ok) {
        throw new Error(`Failed to get transaction status: ${response.statusText}`);
      }
      const resData = await response.json();
      return resData.data;
    } catch (error: any) {
      console.error('Error checking Wompi transaction status:', error.message);
      throw error;
    }
  },

  /**
   * Genera un link de pago (Widget Web) para una experiencia de usuario externa (Redirección segura)
   */
  generateWompiPaymentLink: (params: {
    amountInCents: number;
    reference: string;
    email: string;
  }) => {
    // URL del checkout web pre-construido de Wompi
    const baseUrl = 'https://checkout.wompi.co/p/';
    const url = `${baseUrl}?public-key=${WOMPI_PUBLIC_KEY}&currency=COP&amount-in-cents=${params.amountInCents}&reference=${params.reference}&customer-data:email=${encodeURIComponent(params.email)}&redirect-url=${encodeURIComponent('ubago://payment-result')}`;
    return url;
  },

  /**
   * Calcula la comisión que UBAGO toma de un viaje o un pedido de comida
   */
  calculateUBAGOCut: (amount: number, type: 'ride' | 'food'): number => {
    const rate =
      type === 'ride'
        ? PaymentService.commissionConfig.driverCommissionRate
        : PaymentService.commissionConfig.restaurantCommissionRate;
    return Math.floor(amount * rate);
  },

  /**
   * Registra comisiones o transferencias simuladas para conductores/restaurantes
   */
  calculatePayoutAmount: (amount: number, type: 'ride' | 'food'): number => {
    const ubagoCut = PaymentService.calculateUBAGOCut(amount, type);
    return amount - ubagoCut;
  }
};

export type PaymentServiceType = typeof PaymentService;
