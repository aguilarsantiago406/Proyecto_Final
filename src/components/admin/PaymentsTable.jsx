import React, { useState } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';
import { getPaymentStatusText } from '../../utils/statusUtils'; 
import Button from '../common/Button';

const PaymentsTable = ({ payments, onViewDetails }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusClass = (status) => {
    const classes = {
      approved: 'status-approved',
      pending: 'status-pending',
      rejected: 'status-rejected',
    };
    return classes[status] || 'status-default';
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus === 'all') return true;
    return payment.status === filterStatus;
  });
  
  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    if (sortField === 'date') {
      aValue = new Date(a.date);
      bValue = new Date(b.date);
    }
    return (sortDirection === 'asc') ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <div className="table-wrapper" data-testid="payments-table">
      {/* Filtros */}
      <div className="table-filter-bar">
        <h3>Historial de Pagos</h3>
        <div className="table-filter-controls">
          <label>Filtrar:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            data-testid="payment-status-filter"
          >
            <option value="all">Todos</option>
            <option value="approved">Aprobados</option>
            <option value="pending">Pendientes</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>
      </div>
      
      {/* Tabla */}
      <div className="table-scroll-wrapper">
        <table className="styled-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('date')}>
                Fecha {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Contacto (GHL)</th>
              <th>ID Cita</th>
              <th className="sortable" onClick={() => handleSort('amount')}>
                Monto {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Estado</th>
              <th style={{textAlign: 'right'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedPayments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                  No hay pagos para mostrar
                </td>
              </tr>
            ) : (
              sortedPayments.map((payment) => (
                <tr key={payment.id} data-testid={`payment-row-${payment.id}`}>
                  <td>{formatDate(payment.date)}</td>
                  <td className="contact-cell">
                    <p className="name">{payment.contact_name}</p>
                    <p className="id">{payment.contact_id}</p>
                  </td>
                  <td>
                    <code className="code-cell">{payment.appointment_id}</code>
                  </td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(payment.status)}`}>
                      {getPaymentStatusText(payment.status)}
                    </span>
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails && onViewDetails(payment)}
                      data-testid={`view-payment-${payment.id}`}
                    >
                      Ver detalles
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <p>
          Mostrando <span>{sortedPayments.length}</span> de <span>{payments.length}</span> pagos
        </p>
      </div>
    </div>
  );
};
export default PaymentsTable;