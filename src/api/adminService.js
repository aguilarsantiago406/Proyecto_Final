// src/api/adminService.js
import apiClient from './apiClient';

const adminService = {
  // ... (login, getStats, getPayments, getLogs, exportLogs IGUAL QUE ANTES) ...
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login/', { username, password });
    return response.data;
  },
  getStats: async () => {
    const response = await apiClient.get('/dashboard/summary/');
    return response.data;
  },
  getPayments: async (filters = {}) => {
    const response = await apiClient.get('/payments/list/', { params: filters });
    return response.data;
  },
  getLogs: async (filters = {}) => {
    const response = await apiClient.get('/payments/logs/', { params: filters });
    return response.data;
  },
  exportLogs: async () => {
    const response = await apiClient.get('/dashboard/export/', { responseType: 'blob' });
    return response.data;
  },

  // --- NUEVA FUNCIÓN PARA CREAR PAGO ---
  createPaymentLink: async (paymentData) => {
    // paymentData = { appointmentId, contactId, amount, description }
    const response = await apiClient.post('/payments/create/', paymentData);
    return response.data; 
    // Esperamos que response.data contenga el 'mp_preference_id' o el link directo
  },
};

export default adminService;