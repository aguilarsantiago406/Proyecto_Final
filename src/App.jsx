// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ToastContainer } from './components/common/Toast';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Páginas
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import CreatePayment from './pages/admin/CreatePayment'; // <-- NUEVO
import PaymentHistory from './pages/admin/PaymentHistory';
import AuditLogs from './pages/admin/AuditLogs';
import PaymentDetails from './pages/payment/PaymentDetails';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import PaymentFailure from './pages/payment/PaymentFailure';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Público */}
          <Route path="/" element={<Home />} />
          <Route element={<PublicLayout />}>
            <Route path="/pay/:id" element={<PaymentDetails />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
          </Route>

          {/* Admin Privado */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreatePayment />} /> {/* <-- NUEVA RUTA */}
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="logs" element={<AuditLogs />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;