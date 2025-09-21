import React from 'react';
import Input from './Input';
import Button from './Button';
import '../styles/AuthenticationCard.css';

const AuthenticationCard = ({
  title,
  subtitle,
  inputType = 'text',
  inputPlaceholder,
  inputValue,
  onInputChange,
  buttonText,
  onButtonClick,
  message,
  messageType, // 'success' | 'error'
  bottomText,
  linkText,
  onLinkClick,
  footerText,
  inputProps = {},
  buttonProps = {},
  cardType = 'signin',
}) => {
  const derivedType = messageType || (typeof message === 'string' && message.toLowerCase().includes('success') ? 'success' : 'error');

  return (
    <div className={`auth-card ${message ? 'has-message' : ''}`}>
      <div className='auth-card-title'>{title}</div>
      {subtitle && <p>{subtitle}</p>}
      <Input
        type={inputType}
        placeholder={inputPlaceholder}
        value={inputValue}
        onChange={onInputChange}
        {...inputProps}
      />
      <Button onClick={onButtonClick} {...buttonProps}>
        {buttonText}
      </Button>

      {cardType === 'signup' && linkText && (
        <div className="resend-link">
          <span className="resend-text">Code not receive?</span>
          <a href="#" onClick={onLinkClick}>Send again</a>
        </div>
      )}

      {message && (
        <p className={`message ${derivedType}`}>
          {message}
        </p>
      )}
      {bottomText && <p className="bottom-text">{bottomText}</p>}

      {cardType === 'signin' && linkText && (
        <div className="auth-card-footer">
          {footerText && <span className="footer-text">{footerText}</span>}
          <a href="#" onClick={onLinkClick}>{linkText}</a>
        </div>
      )}
    </div>
  );
};

export default AuthenticationCard;