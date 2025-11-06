// src/pages/ClientPaymentForm.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import paymentService from '../api/paymentService';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ClientPaymentForm = () => {
  // 1. Estados para los datos amigables del usuario
  const [formData, setFormData] = useState({
    fullName: '',   // Nombre real del cliente
    phone: '',      // Usaremos esto como ID de contacto provisional
    amount: '',
    concept: ''     // Motivo del pago
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 2. TRUCO: Generar IDs automáticos para cumplir con el backend
    // Generamos un ID de cita único basado en la hora actual
    const autoAppointmentId = `AUTO-${Date.now()}`;
    
    // Combinamos el concepto con el nombre para no perder ese dato
    const fullDescription = `${formData.concept} | Cliente: ${formData.fullName}`;

    try {
      // 3. Llamada al backend con los datos "traducidos"
      const data = await paymentService.createPayment({
        contactId: formData.phone,      // Usamos el celular como ID de contacto
        appointmentId: autoAppointmentId, // ID generado automáticamente
        amount: parseFloat(formData.amount),
        description: fullDescription    // Descripción combinada
      });

      const mpLink = data.init_point || data.sandbox_init_point || data.url;

      if (mpLink) {
        // 4. Redirigir a Mercado Pago
        window.location.href = mpLink;
      } else {
        setError('Error: El sistema no devolvió un enlace de pago.');
      }

    } catch (err) {
      console.error(err);
      // Mensaje amigable si el backend rechaza el "celular" como ID
      setError('No se pudo generar el pago. Verifica los datos o intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{padding: '2rem'}}>
      <div className="login-box" style={{ maxWidth: '32rem' }}>
        <div className="login-header">
          <div className="login-logo" style={{ backgroundColor: 'var(--color-success)' }}>
            <span style={{ fontSize: '2.5rem' }}>💸</span>
          </div>
          <h1>Realizar un Pago</h1>
          <p>Completa tus datos para procesar el pago de forma segura</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label="Nombre Completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Ej: Juan Pérez"
            />
            
            <Input
              label="Número de Celular"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Ej: 999888777"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <Input
                label="Monto (S/)"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
              <Input
                label="Motivo de Pago"
                name="concept"
                value={formData.concept}
                onChange={handleChange}
                required
                placeholder="Ej: Consulta"
              />
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              fullWidth 
              loading={loading}
            >
              Generar y Pagar →
            </Button>
          </form>
        </Card>

        <div className="login-footer">
          <Link to="/" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>
            ← Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientPaymentForm;