import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ToastContainer } from "./components/common/Toast";
import Home from "./pages/Home";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";

// --- Importa la nueva página ---
import ClientPortal from "./pages/ClientPortal"; 

// Páginas Admin
import Login from "./pages/Admin/Login";
import Dashboard from "./pages/Admin/Dashboard";
import PaymentHistory from "./pages/Admin/PaymentHistory";
import AuditLogs from "./pages/Admin/AuditLogs";

// Páginas de Pago
import PaymentDetails from "./pages/payment/PaymentDetails";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailure from "./pages/payment/PaymentFailure";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route element={<PublicLayout />}>
            {/* Home / Landing */}
            <Route index element={<Home />} />
            
            {/* Nuevo Portal de Cliente */}
            <Route path="portal" element={<ClientPortal />} />

            {/* Flujo de Pago */}
            <Route path="pay/:id" element={<PaymentDetails />} />
            <Route path="payment/success" element={<PaymentSuccess />} />
            <Route path="payment/failure" element={<PaymentFailure />} />
          </Route>

          {/* --- RUTAS DE ADMIN --- */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="logs" element={<AuditLogs />} />
          </Route>
          
          {/* Redirección para rutas no encontradas (opcional) */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;