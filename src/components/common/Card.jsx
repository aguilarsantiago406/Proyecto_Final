import React from 'react';

const Card = ({ children, className, ...props }) => {
  const combinedClassName = `card ${className || ''}`;
  
  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};
export default Card;