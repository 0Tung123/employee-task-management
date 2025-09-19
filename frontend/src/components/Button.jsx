import React from 'react';

const Button = ({ onClick, disabled = false, children, className = '', ...props }) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;