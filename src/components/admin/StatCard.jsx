import React from 'react';
import Card from '../common/Card';
import { formatNumber, abbreviateNumber } from '../../utils/formatUtils'; // <-- Ruta relativa

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue',
  trend,
  subtitle,
  abbreviate = false 
}) => {
  
  const displayValue = abbreviate && typeof value === 'number' 
    ? abbreviateNumber(value) 
    : typeof value === 'number' 
    ? formatNumber(value) 
    : value;
  
  return (
    <Card className="stat-card" data-testid="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-info">
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{displayValue}</p>
          
          {subtitle && (
            <p className="stat-card-subtitle">{subtitle}</p>
          )}
          
          {trend && (
            <div className="stat-card-trend">
              {trend.direction === 'up' ? (
                <svg width="16" height="16" style={{color: 'var(--color-success)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg width="16" height="16" style={{color: 'var(--color-error)'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              <span className={`stat-card-trend-value ${trend.direction === 'up' ? 'up' : 'down'}`}>
                {trend.value}
              </span>
              <span className="stat-card-trend-label">{trend.label}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`stat-card-icon ${color}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;