import React from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'md',
  closeOnOverlayClick = true 
}) => {
  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  const sizeClass = size === 'lg' ? 'modal-content-lg' : '';
  
  return (
    <div 
      className="modal-overlay"
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div 
        className={`modal-content ${sizeClass}`}
        data-testid="modal-content"
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            onClick={onClose}
            className="modal-close-btn"
            data-testid="modal-close-button"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;