import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ 
  onSendMessage, 
  onTyping, 
  disabled = false,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicator
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      onTyping && onTyping(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping && onTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    
    if (trimmedMessage && !disabled && onSendMessage) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Clear typing indicator
      setIsTyping(false);
      onTyping && onTyping(false);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="message-input-area">
      {/* Debug info */}
      <div style={{ fontSize: '12px', color: 'red', marginBottom: '5px' }}>
      </div>
      
      <div className="message-input-container">
        <textarea
          ref={textareaRef}
          className="message-input"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{ backgroundColor: disabled ? '#f0f0f0' : '#ffffff' }}
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={disabled || !message.trim()}
          type="button"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;