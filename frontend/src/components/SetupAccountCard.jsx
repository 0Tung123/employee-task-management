import React from 'react';
import '../styles/SetupAccountCard.css';

const SetupAccountCard = ({
  title,
  subtitle,
  children,
  message,
  messageType,
}) => {
  const derivedType = messageType || (typeof message === 'string' && message.toLowerCase().includes('success') ? 'success' : 'error');

  return (
    <div className={`setup-card ${message ? 'has-message' : ''}`}>
      <div className='setup-card-title'>{title}</div>
      {subtitle && <p className="setup-subtitle">{subtitle}</p>}
      
      <div className="setup-content">
        {children}
      </div>

      {message && (
        <p className={`message ${derivedType}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default SetupAccountCard;