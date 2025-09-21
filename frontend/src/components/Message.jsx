import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
import { getAllEmployees } from '../API/owner';
import '../styles/Message.css';

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    loadMessages();
    loadEmployees();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      setMessages([]);
      setMessage('No messages available. Message API integration pending.');
    } catch (error) {
      setMessage('Failed to load messages');
    }
    setLoading(false);
  };

  const loadEmployees = async () => {
    try {
      const response = await getAllEmployees();
      if (response.success && response.employees) {
        setEmployees(response.employees);
      } else {
        setMessage('Failed to load employees');
        setEmployees([]);
      }
    } catch (error) {
      setMessage('Failed to load employees');
      setEmployees([]);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newMessage = {
        id: Date.now().toString(),
        from: 'owner@company.com',
        fromName: 'Manager',
        to: formData.recipient,
        toName: employees.find(emp => emp.email === formData.recipient)?.name || 'Unknown',
        subject: formData.subject,
        content: formData.content,
        timestamp: new Date().toISOString(),
        read: true,
        type: 'sent'
      };
      setMessages([newMessage, ...messages]);
      setMessage('Message sent successfully');
      setFormData({ recipient: '', subject: '', content: '' });
      setShowComposeForm(false);
    } catch (error) {
      setMessage('Failed to send message');
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      setMessage('Failed to mark message as read');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    try {
      setMessages(messages.filter(msg => msg.id !== messageId));
      setMessage('Message deleted successfully');
      if (selectedConversation?.id === messageId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      setMessage('Failed to delete message');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageTypeIcon = (type) => {
    return type === 'sent' ? '📤' : '📥';
  };

  const groupMessagesByConversation = () => {
    const conversations = {};
    messages.forEach(msg => {
      const otherParty = msg.type === 'sent' ? msg.to : msg.from;
      if (!conversations[otherParty]) {
        conversations[otherParty] = [];
      }
      conversations[otherParty].push(msg);
    });
    return conversations;
  };

  const conversations = groupMessagesByConversation();

  return (
    <div className="message-component">
      <div className="section-header">
        <h2>Messages</h2>
        <Button 
          onClick={() => setShowComposeForm(true)}
          className="compose-btn"
          disabled={showComposeForm}
        >
          ✉️ Compose Message
        </Button>
      </div>

      {message && (
        <div className={`message-alert ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {showComposeForm && (
        <div className="compose-form">
          <h3>Compose New Message</h3>
          <form onSubmit={handleSendMessage}>
            <div className="form-row">
              <select
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="">Select Recipient</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.email}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <Input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <textarea
                name="content"
                placeholder="Message content..."
                value={formData.content}
                onChange={handleInputChange}
                required
                className="form-textarea"
                rows="5"
              />
            </div>
            <div className="form-actions">
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
              <Button 
                type="button" 
                onClick={() => setShowComposeForm(false)}
                className="cancel-btn"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="message-layout">
        <div className="conversation-list">
          <h3>Conversations</h3>
          {Object.keys(conversations).length === 0 ? (
            <p>No conversations yet</p>
          ) : (
            Object.entries(conversations).map(([email, msgs]) => {
              const latestMsg = msgs[0];
              const unreadCount = msgs.filter(m => !m.read && m.type === 'received').length;
              const otherPartyName = latestMsg.type === 'sent' ? latestMsg.toName : latestMsg.fromName;
              
              return (
                <div 
                  key={email}
                  className={`conversation-item ${selectedConversation?.email === email ? 'active' : ''}`}
                  onClick={() => setSelectedConversation({ email, name: otherPartyName, messages: msgs })}
                >
                  <div className="conversation-header">
                    <span className="conversation-name">{otherPartyName}</span>
                    {unreadCount > 0 && (
                      <span className="unread-badge">{unreadCount}</span>
                    )}
                  </div>
                  <div className="conversation-preview">
                    <span className="preview-subject">{latestMsg.subject}</span>
                    <span className="preview-time">{formatTimestamp(latestMsg.timestamp)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="message-detail">
          {selectedConversation ? (
            <div>
              <div className="conversation-header">
                <h3>Conversation with {selectedConversation.name}</h3>
              </div>
              <div className="message-thread">
                {selectedConversation.messages.map((msg) => (
                  <div key={msg.id} className={`message-item ${msg.type}`}>
                    <div className="message-header">
                      <span className="message-icon">{getMessageTypeIcon(msg.type)}</span>
                      <span className="message-from">
                        {msg.type === 'sent' ? 'You' : msg.fromName}
                      </span>
                      <span className="message-time">{formatTimestamp(msg.timestamp)}</span>
                      {!msg.read && msg.type === 'received' && (
                        <button 
                          className="mark-read-btn"
                          onClick={() => handleMarkAsRead(msg.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                      <button 
                        className="delete-msg-btn"
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="message-subject">
                      <strong>{msg.subject}</strong>
                    </div>
                    <div className="message-content">
                      {msg.content}
                    </div>
                    {!msg.read && msg.type === 'received' && (
                      <div className="unread-indicator">New</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-conversation">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>

      {messages.length > 0 && (
        <div className="message-stats">
          <div className="stat-card">
            <h4>Total Messages</h4>
            <span className="stat-number">{messages.length}</span>
          </div>
          <div className="stat-card">
            <h4>Sent</h4>
            <span className="stat-number sent">
              {messages.filter(msg => msg.type === 'sent').length}
            </span>
          </div>
          <div className="stat-card">
            <h4>Received</h4>
            <span className="stat-number received">
              {messages.filter(msg => msg.type === 'received').length}
            </span>
          </div>
          <div className="stat-card">
            <h4>Unread</h4>
            <span className="stat-number unread">
              {messages.filter(msg => !msg.read && msg.type === 'received').length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;