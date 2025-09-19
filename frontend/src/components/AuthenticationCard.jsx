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
  bottomText,
  linkText,
  onLinkClick,
  inputProps = {},
  buttonProps = {},
  cardType = 'signin',
}) => {
  return (
    <div className="auth-card">
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

      {message && <p className={`message ${message.includes('success') ? 'success' : ''}`}>{message}</p>}
      {bottomText && <p className="bottom-text">{bottomText}</p>}

      {cardType === 'signin' && (bottomText || linkText) && (
        <div className="auth-card-footer">
          <span className="footer-text">Don't having account?</span>
          {linkText && <a href="#" onClick={onLinkClick}>Sign up</a>}
        </div>
      )}
    </div>
  );
};

export default AuthenticationCard;