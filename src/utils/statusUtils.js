export const getPaymentStatusText = (status) => {
  const texts = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    rejected: 'Rechazado',
    failed: 'Fallido',
    refunded: 'Reembolsado',
  };
  return texts[status] || 'Desconocido';
};

export const getLogEventIcon = (event) => {
  const icons = {
    payment_approved: '✅',
    payment_rejected: '❌',
    payment_link_created: '🔗',
    ghl_sync: '🔄',
    webhook_received: '📥',
    error: '⚠️',
  };
  return icons[event] || '📄';
};