import React, { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi'; 
import adminService from '../../api/adminService';
import PaymentsTable from '../../components/admin/PaymentsTable'; 
import LoadingSpinner from '../../components/common/LoadingSpinner'; 
import Modal from '../../components/common/Modal'; 
import { formatCurrency } from '../../utils/formatUtils'; 
import { formatDate } from '../../utils/dateUtils'; 
import Button from '../../components/common/button'; 

const PaymentHistory = () => {
  const { data, loading, error, execute } = useApi(adminService.getPayments);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => { execute(); }, [execute]);

  const handleViewDetails = (payment) => setSelectedPayment(payment);
  const handleCloseModal = () => setSelectedPayment(null);

  if (loading && !data) {
    return (
      <div className="page-loader">
        <LoadingSpinner size="lg" message="Cargando historial de pagos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{textAlign: 'center', padding: '3rem', color: 'var(--color-error)'}}>
        <p>Error al cargar el historial: {error.message}</p>
      </div>
    );
  }

  return (
    <div data-testid="payment-history-page">
      <div className="page-header">
        <h1>Historial de Pagos</h1>
        <p>Revisa todas las transacciones procesadas por el sistema.</p>
      </div>

      <PaymentsTable 
        payments={data?.payments || []} 
        onViewDetails={handleViewDetails} 
      />

      <Modal
        isOpen={!!selectedPayment}
        onClose={handleCloseModal}
        title="Detalles del Pago"
        size="md"
        footer={<Button onClick={handleCloseModal}>Cerrar</Button>}
      >
        {selectedPayment && (
          <div className="payment-info-details">
            <InfoRow label="ID de Pago (MP)" value={selectedPayment.mp_payment_id} />
            <InfoRow label="Contacto GHL" value={selectedPayment.contact_name} />
            <InfoRow label="ID Contacto (GHL)" value={selectedPayment.contact_id} />
            <InfoRow label="ID Cita (GHL)" value={selectedPayment.appointment_id} />
            <InfoRow label="Fecha" value={formatDate(selectedPayment.date)} />
            <InfoRow label="Monto" value={formatCurrency(selectedPayment.amount)} />
            <InfoRow label="Estado" value={selectedPayment.status} />
          </div>
        )}
      </Modal>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="payment-info-row">
    <span>{label}:</span>
    <span>{value}</span>
  </div>
);

export default PaymentHistory;