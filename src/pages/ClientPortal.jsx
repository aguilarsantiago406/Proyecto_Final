import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/button';

const ClientPortal = () => {
  const [paymentId, setPaymentId] = useState('');
  const navigate = useNavigate();

  const handleGoToPay = (e) => {
    e.preventDefault();
    if (paymentId.trim()) {
      // Redirige a la ruta de pago pública
      navigate(`/pay/${paymentId.trim()}`);
    }
  };

  return (
    <div className="login-container" data-testid="client-portal-page">
      <div className="login-box">
        <div className="login-header">
          {/* Reutilizamos estilos del logo pero con otro color */}
          <div className="login-logo" style={{ backgroundColor: 'var(--color-success)' }}>
             <span style={{ fontSize: '2.5rem' }}>💳</span>
          </div>
          <h1>Portal de Pagos</h1>
          <p>Ingresa el código o ID de pago que recibiste</p>
        </div>

        <Card>
          <form onSubmit={handleGoToPay} className="login-form">
            <Input
              label="Código de Pago"
              placeholder=""
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              required
            />
            
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              fullWidth={true}
            >
              Buscar mi Pago →
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

export default ClientPortal;