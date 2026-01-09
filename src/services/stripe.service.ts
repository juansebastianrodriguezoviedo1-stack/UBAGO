import { loadStripe, Stripe } from '@stripe/stripe-js';
import axios from 'axios';

interface PaymentIntentParams {
  amount: number; // en centavos
  currency: string;
  paymentMethodId: string;
  description: string;
  metadata?: Record<string, any>;
}

interface CommissionConfig {
  driverCommissionRate: number; // 0.25 = 25%
  restaurantCommissionRate: number; // 0.30 = 30%
  processingFee: number; // 0.029 + $0.30
}

export const StripeService = {
  // Configuración de comisiones
  commissionConfig: {
    driverCommissionRate: 0.25, // UBAGO toma 25% de cada viaje
    restaurantCommissionRate: 0.30, // UBAGO toma 30% de cada orden
    processingFee: 0.029, // Stripe + 2.9%
  } as CommissionConfig,

  // Inicializar Stripe
  initStripe: async (): Promise<Stripe | null> => {
    const stripe = await loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    return stripe;
  },

  // Crear Payment Intent para viaje
  createRidePaymentIntent: async (params: {
    rideId: string;
    passengerId: string;
    driverId: string;
    amount: number; // monto total en centavos
    paymentMethodId: string;
  }) => {
    try {
      const ubagoCut = Math.floor(params.amount * StripeService.commissionConfig.driverCommissionRate);
      const driverCut = params.amount - ubagoCut;

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/payments/create-ride-payment`,
        {
          rideId: params.rideId,
          passengerId: params.passengerId,
          driverId: params.driverId,
          totalAmount: params.amount,
          ubagoCut,
          driverCut,
          paymentMethodId: params.paymentMethodId,
          timestamp: new Date().toISOString(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating ride payment intent:', error);
      throw error;
    }
  },

  // Crear Payment Intent para orden de comida
  createFoodPaymentIntent: async (params: {
    orderId: string;
    userId: string;
    restaurantId: string;
    amount: number; // monto total en centavos
    paymentMethodId: string;
  }) => {
    try {
      const ubagoCut = Math.floor(params.amount * StripeService.commissionConfig.restaurantCommissionRate);
      const restaurantCut = params.amount - ubagoCut;

      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/payments/create-food-payment`,
        {
          orderId: params.orderId,
          userId: params.userId,
          restaurantId: params.restaurantId,
          totalAmount: params.amount,
          ubagoCut,
          restaurantCut,
          paymentMethodId: params.paymentMethodId,
          timestamp: new Date().toISOString(),
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating food payment intent:', error);
      throw error;
    }
  },

  // Procesar pago
  processPayment: async (params: {
    paymentIntentId: string;
    paymentMethodId: string;
  }) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/payments/process-payment`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },

  // Confirmar pago completado
  confirmPayment: async (paymentIntentId: string) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/payments/confirm-payment`,
        { paymentIntentId }
      );
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },

  // Refund de pago
  refundPayment: async (params: {
    paymentIntentId: string;
    reason: 'customer_request' | 'fraud' | 'duplicate' | 'requested_by_customer';
  }) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/payments/refund`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  },

  // Obtener balance de cuenta
  getAccountBalance: async (userId: string) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/payments/balance/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting account balance:', error);
      throw error;
    }
  },

  // Solicitar payout (transferencia a cuenta bancaria)
  requestPayout: async (params: {
    userId: string;
    amount: number;
    bankAccountId: string;
  }) => {
    try {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/payments/request-payout`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting payout:', error);
      throw error;
    }
  },

  // Calcular comisión UBAGO
  calculateUBAGOCut: (amount: number, type: 'ride' | 'food'): number => {
    const rate =
      type === 'ride'
        ? StripeService.commissionConfig.driverCommissionRate
        : StripeService.commissionConfig.restaurantCommissionRate;
    return Math.floor(amount * rate);
  },

  // Obtener historial de transacciones
  getTransactionHistory: async (userId: string) => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/payments/transactions/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw error;
    }
  },
};

export type StripeServiceType = typeof StripeService;
