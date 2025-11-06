import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/common/Button'; 
import Card from '../../components/common/Card';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference');
  
  return (
    <div className="payment-page-box" data-testid="payment-success-page">
      <Card className="payment-result-box">
        <div className="payment-result-icon success">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1>¡Pago Exitoso!</h1>
        <p className="subtitle">Tu pago ha sido procesado correctamente.</p>
        
        <div className="payment-result-details">
          <h3>Detalles de la Transacción</h3>
          <div className="detail-grid">
            {paymentId && (
              <div className="detail-row">
                <span className="label">ID de Pago:</span>
                <code className="value">{paymentId}</code>
              </div>
            )}
            {externalReference && (
              <div className="detail-row">
                <span className="label">Referencia:</span>
                <code className="value">{externalReference}</code>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Estado:</span>
              <span className="status-badge status-approved">Aprobado</span>
            </div>
          </div>
        </div>
        
        <div className="info-box blue">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h4>¿Qué sigue?</h4>
            <p>
              Recibirás un email de confirmación con los detalles de tu pago. 
              Tu cita ha sido confirmada automáticamente.
            </p>
          </div>
        </div>
        
        <div className="payment-result-actions">
          <Button variant="primary" onClick={() => window.close()}>
            Cerrar Ventana
          </Button>
          <Button variant="outline" onClick={() => console.log('Ir a mis citas')}>
            Ver Mis Citas
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default PaymentSuccess;