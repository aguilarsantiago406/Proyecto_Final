import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button'; // <-- Ruta relativa
import Card from '../../components/common/Card'; // <-- Ruta relativa

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const errorMessage = searchParams.get('error') || 'El pago no pudo ser procesado';
  const paymentId = searchParams.get('payment_id');
  
  return (
    <div className="payment-page-box" data-testid="payment-failure-page">
      <Card className="payment-result-box">
        <div className="payment-result-icon failure">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <h1>Pago No Procesado</h1>
        <p className="subtitle">Hubo un problema al procesar tu pago.</p>
        
        <div className="info-box red">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h4>Detalles del Error</h4>
            <p>{errorMessage}</p>
            {paymentId && (
              <p className="muted">ID de pago: {paymentId}</p>
            )}
          </div>
        </div>
        
        <div className="info-box blue">
          <h4> Posibles Razones</h4>
          <ul>
            <li>Fondos insuficientes en la tarjeta</li>
            <li>Datos de la tarjeta incorrectos</li>
            <li>La transacción fue rechazada por tu banco</li>
          </ul>
        </div>
        
        <div className="payment-result-actions">
          <Button variant="primary" onClick={() => navigate(-1)}>
            <svg width="16" height="16" style={{marginRight: '0.5rem'}} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Intentar Nuevamente
          </Button>
          <Button variant="outline" onClick={() => { window.location.href = 'mailto:soporte@rppagos.com'; }}>
            Contactar Soporte
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default PaymentFailure;