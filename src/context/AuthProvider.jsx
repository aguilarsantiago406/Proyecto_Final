// src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import adminService from '../api/adminService';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    // Podríamos intentar validar el token con /api/auth/me/  aquí si quisiéramos ser más robustos.
    if (storedToken) {
      setToken(storedToken);
      // Por ahora asumimos que el usuario sigue logueado si hay token.
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => { // <-- Cambiado 'email' por 'username'
    try {
      const response = await adminService.login(username, password);
      // Asumimos que la respuesta del backend tiene esta estructura (ajustar si es diferente)
      // { "access": "...", "refresh": "..." } es común en Django/Python, o tal vez { "token": "..." }
      const token = response.access || response.token; 
      
      if (token) {
        localStorage.setItem('admin_token', token);
        setToken(token);
        // Podríamos llamar a /api/auth/me/  aquí para obtener los datos del usuario
        setUser({ name: username }); // Guardamos el username temporalmente
        return { success: true };
      } else {
         return { success: false, message: "No se recibió token del servidor" };
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => !!token;

  const value = { user, token, loading, login, logout, isAuthenticated };

  if (loading) return <div>Cargando...</div>;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};