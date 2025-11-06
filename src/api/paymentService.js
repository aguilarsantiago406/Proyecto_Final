// src/api/paymentService.js
import apiClient from './apiClient';

const paymentService = {
  // Endpoint para que el usuario genere su propio link
  createPayment: async (paymentData) => {
    try {
      // Enviamos los datos al backend
      const response = await apiClient.post('/payments/create/', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el pago:', error);
      throw error;
    }
  },

  getPaymentDetails: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles del pago:', error);
      throw error;
    }
  },
};

export default paymentService;