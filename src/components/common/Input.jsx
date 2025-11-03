import React from 'react';

const Input = React.forwardRef(({ 
  label,
  error,
  className,
  ...props 
}, ref) => {
  
  const inputClassName = `form-input ${error ? 'form-input-error' : ''} ${className || ''}`;
  
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={inputClassName}
        {...props}
      />
      {error && (
        <p className="form-error-text">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;