export const formatCurrency = (amount, currency = 'PEN') => {
  if (amount === null || amount === undefined) return '-';
  
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency, 
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number) => {
  if (number === null || number === undefined) return '-';
  return new Intl.NumberFormat('es-PE').format(number);
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-';
  return `${value.toFixed(decimals)}%`;
};

export const abbreviateNumber = (number) => {
  if (number === null || number === undefined) return '-';
  
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return number.toString();
};