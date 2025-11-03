import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import paymentService from '../../api/paymentService';
import PaymentInfo from '../../components/payment/PaymentInfo'; 
import Button from '../../components/common/button'; 
import LoadingSpinner from '../../components/common/LoadingSpinner'; 

const PaymentDetails = () => {
  const { id } = useParams();
  const { data: paymentData, loading, error, execute } = useApi(paymentService.getPaymentDetails);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  useEffect(() => {
    if (id) { execute(id); }
  }, [id, execute]);
  
  const handleProceedToPayment = () => {
    if (!paymentData?.mp_preference_id) {
      console.error('No se encontró el ID de preferencia de Mercado Pago');
      return;
    }
    setIsRedirecting(true);
    const mpUrl = `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${paymentData.mp_preference_id}`;
    setTimeout(() => {
      console.log('Redirigiendo a:', mpUrl);
      if (window.showToast) {
        window.showToast('💳 En producción, serías redirigido a Mercado Pago.', 'info', 5000);
      }
      setIsRedirecting(false);
    }, 1500);
  };
  
  if (loading) {
    return (
      <div className="page-loader">
        <LoadingSpinner size="lg" message="Cargando detalles del pago..." />
      </div>
    );
  }
  
  if (error || !paymentData) {
    return (
      <div className="payment-page-box" style={{textAlign: 'center'}}>
        <div className="payment-result-icon failure">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem'}}>Pago no encontrado</h2>
        <p style={{color: 'var(--text-secondary)'}}>
          No se pudo encontrar el pago solicitado. Verifica el enlace e intenta nuevamente.
        </p>
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
          data-testid="proceed-to-payment-button"
        >
          {isRedirecting ? 'Redirigiendo...' : 'Proceder al Pago'}
        </Button>
        <p>Serás redirigido a Mercado Pago para completar el pago de forma segura</p>
      </div>
      
      <div className="payment-security-box">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <h4>Pago 100% Seguro</h4>
          <p>
            Tu información de pago está protegida. Procesado por Mercado Pago.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;