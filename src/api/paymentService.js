import apiClient from './apiClient';

const paymentService = {
  getPaymentDetails: async (paymentId) => {
    //DATOS FALSOS ACTIVADOS
    if (paymentId) {
      console.warn("Usando datos MOCK para getPaymentDetails");
      return {
        id: paymentId, 
        contact_name: 'Juan Pérez (Prueba)', 
        appointment_date: '2025-01-20T15:00:00Z',
        appointment_type: 'Consulta de Prueba', 
        amount: 50.00, 
        currency: 'PEN',
        description: 'Pago por consulta de prueba', 
        mp_preference_id: 'pref_mock_12345',
        status: 'pending', 
        created_at: '2025-01-15T10:30:00Z',
      };
    }
    //FIN DE DATOS FALSOS 

    /*
    // CÓDIGO REAL (Comentado por ahora)
    try {
      const response = await apiClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener detalles del pago:', error);
      throw error;
    }
    */
  },
};

export default paymentService;