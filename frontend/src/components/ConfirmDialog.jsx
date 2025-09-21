import React from 'react';
import Button from './Button';
import '../styles/ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel,
  type = 'default'
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '⚠️';
      default:
        return '❓';
    }
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleBackdropClick}>
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <div className="confirm-dialog-icon">
            {getIcon()}
          </div>
          <h3 className="confirm-dialog-title">{title}</h3>
        </div>
        
        <div className="confirm-dialog-content">
          <p className="confirm-dialog-message">{message}</p>
        </div>
        
        <div className="confirm-dialog-actions">
          <Button 
            onClick={onCancel}
            className="cancel-button"
            type="button"
          >
            {cancelText}
          </Button>
          <Button 
            onClick={onConfirm}
            className={`confirm-button ${type === 'danger' ? 'danger' : ''}`}
            type="button"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;