import React from 'react';

const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  fullWidth = false,
  disabled,
  loading,
  ...props 
}, ref) => {
  
  let classNames = 'btn';
  
  if (variant === 'primary') classNames += ' btn-primary';
  if (variant === 'outline') classNames += ' btn-outline';
  if (variant === 'ghost') classNames += ' btn-ghost';
  
  if (size === 'lg') classNames += ' btn-lg';
  if (size === 'sm') classNames += ' btn-sm';
  
  if (fullWidth) classNames += ' btn-full';
  if (className) classNames += ` ${className}`;

  return (
    <button
      ref={ref}
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="btn-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;