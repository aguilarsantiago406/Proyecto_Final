import apiClient from './apiClient';

const adminService = {
  login: async (email, password) => {
    //SIMULACIÓN DE LOGIN
    console.warn("--- MODO DE PRUEBA: Login Simulado ---");
    return {
      success: true,
      token: "token_falso_12345",
      user: { name: "Administrador de Prueba", email: email }
    };
    //FIN DE SIMULACIÓN

    /*
    // CÓDIGO REAL
    try {
      const response = await apiClient.post('/admin/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
    */
  },

  getStats: async () => {
    //DATOS FALSOS ACTIVADOS
    console.warn("Usando datos MOCK para getStats");
    return {
      total_payments: 150, approved_payments: 120, pending_payments: 20,
      rejected_payments: 10, total_amount: 15000.50, ghl_contacts_synced: 95,
      today_payments: 25, success_rate: 80,
    };
    //FIN DE DATOS FALSOS

    /*
    // CÓDIGO REAL (Comentado por ahora)
    try {
      const response = await apiClient.get('/metrics/overview');
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
    */
  },

  getPayments: async (filters = {}) => {
    //DATOS FALSOS ACTIVADOS
    console.warn("Usando datos MOCK para getPayments");
    return {
      payments: [
        { id: 'pmt_001', date: '2025-01-15T10:30:00Z', contact_name: 'Juan Pérez', contact_id: 'ghl_abc123', appointment_id: 'apt_xyz789', amount: 50.00, status: 'approved', mp_payment_id: 'mp_12345' },
        { id: 'pmt_002', date: '2025-01-15T09:15:00Z', contact_name: 'María López', contact_id: 'ghl_def456', appointment_id: 'apt_uvw456', amount: 75.50, status: 'pending', mp_payment_id: 'mp_67890' },
        { id: 'pmt_003', date: '2025-01-14T18:45:00Z', contact_name: 'Carlos Rodríguez', contact_id: 'ghl_ghi789', appointment_id: 'apt_rst123', amount: 120.00, status: 'rejected', mp_payment_id: 'mp_11223' },
      ],
      total: 3, page: 1, pages: 1,
    };
    //FIN DE DATOS FALSOS

    /*
    // CÓDIGO REAL
    try {
      const response = await apiClient.get('/payments/list', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      throw error;
    }
    */
  },

  getLogs: async (filters = {}) => {
    // DATOS FALSOS ACTIVADOS
    console.warn("Usando datos MOCK para getLogs");
    return {
      logs: [
        { id: 'log_001', timestamp: '2025-01-15T10:30:15Z', event: 'payment_approved', message: 'Pago aprobado para Juan Pérez ($50.00)', user_id: 'admin_001', details: { payment_id: 'pmt_001', amount: 50.00 } },
        { id: 'log_002', timestamp: '2025-01-15T10:28:00Z', event: 'payment_link_created', message: 'Link de pago creado para Juan Pérez', user_id: 'admin_001', details: { payment_id: 'pmt_001' } },
        { id: 'log_003', timestamp: '2025-01-15T09:00:00Z', event: 'ghl_sync', message: 'Conexión con GHL actualizada', user_id: 'system', details: { contacts_synced: 95 } },
      ],
      total: 3,
    };
    //FIN DE DATOS FALSOS
    
    /*
    // CÓDIGO REAL
    try {
      const response = await apiClient.get('/audit/logs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error al obtener logs:', error);
      throw error;
    }
    */
  },

  exportLogs: async (date) => {
    console.warn("Simulando descarga de logs");
    const csvContent = "timestamp,event,message\n2025-01-15T10:30:15Z,payment_approved,Pago aprobado";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return blob;
  },
};

export default adminService;