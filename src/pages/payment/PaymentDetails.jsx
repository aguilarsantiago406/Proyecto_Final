// src/pages/payment/PaymentDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PaymentInfo from '../../components/payment/PaymentInfo';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PaymentDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Lee TODOS los datos de la URL
    const data = {
      contact_name: searchParams.get('client'),
      amount: searchParams.get('amount'),
      currency: 'PEN', // Forzamos Soles por ahora
      description: searchParams.get('desc'),
      mp_preference_id: searchParams.get('pref_id'),
      // Usamos la fecha actual si no viene en la URL
      appointment_date: new Date().toISOString() 
    };

    // Solo mostramos los datos si tenemos el ID crítico de Mercado Pago
    if (data.mp_preference_id) {
      setPaymentData(data);
    }
    // Simular carga breve para mejor UX
    setTimeout(() => setLoading(false), 500);
  }, [searchParams]);
  
  const handleProceedToPayment = () => {
    if (!paymentData?.mp_preference_id) return;
    setIsRedirecting(true);
    // URL de producción de Mercado Pago Perú
    const mpUrl = `https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=${paymentData.mp_preference_id}`;
    window.location.href = mpUrl;
  };
  
  if (loading) {
    return (
      <div className="page-loader">
        <LoadingSpinner size="lg" message="Verificando información del pago..." />
      </div>
    );
  }
  
  if (!paymentData) {
    return (
      <div className="payment-page-box" style={{textAlign: 'center', padding: '4rem 1rem'}}>
        <h2 style={{fontSize: '1.5rem', color: 'var(--color-error)', marginBottom: '1rem'}}>Enlace Inválido</h2>
        <p>Este enlace de pago parece estar incompleto. Falta información clave para procesarlo.</p>
      </div>
    );
  }
  
  return (
    <div className="payment-page-box" data-testid="payment-details-page">
      <PaymentInfo paymentData={paymentData} />
      <div className="payment-action-box">
        <Button
          variant="primary"
          size="lg"
          fullWidth={true}
          onClick={handleProceedToPayment}
          loading={isRedirecting}
        >
          {isRedirecting ? 'Conectando con Mercado Pago...' : 'Pagar Ahora'}
        </Button>
        <p style={{marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
          Serás redirigido a la pasarela segura de Mercado Pago.
        </p>
      </div>
    </div>
  );
};

export default PaymentDetails;