import React, { useState, useEffect } from "react";
import adminService from "../api/adminService"; // <-- Ruta relativa
import { AuthContext } from "./AuthContext"; // <-- Ruta relativa

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await adminService.login(email, password);
      const { token: newToken, user: userData } = response;

      // Guardar en localStorage y estado
      if (newToken && userData) {
        localStorage.setItem("admin_token", newToken);
        localStorage.setItem("admin_user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
      }

      // Retornar la respuesta original para que el caller tenga info completa
      return response;
    } catch (error) {
      console.error("Error en login:", error);
      // Normalizar el error para el caller
      const err = error?.message
        ? { success: false, message: error.message }
        : { success: false, message: "Error de conexión" };
      return err;
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
