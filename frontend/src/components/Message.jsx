import React, { useState, useEffect } from 'react';
import Button from './Button';
import Input from './Input';
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
      // TODO: Implement message API calls
      // For now, using mock data
      const mockMessages = [
        {
          id: '1',
          from: 'owner@company.com',
          fromName: 'Manager',
          to: 'john@example.com',
          toName: 'John Doe',
          subject: 'Project Update Required',
          content: 'Hi John, please provide an update on the current project status.',
          timestamp: '2024-01-03T10:30:00Z',
          read: true,
          type: 'sent'
        },
        {
          id: '2',
          from: 'jane@example.com',
          fromName: 'Jane Smith',
          to: 'owner@company.com',
          toName: 'Manager',
          subject: 'Leave Request',
          content: 'Hi, I would like to request leave for next week. Please let me know if this is possible.',
          timestamp: '2024-01-02T14:15:00Z',
          read: false,
          type: 'received'
        },
        {
          id: '3',
          from: 'owner@company.com',
          fromName: 'Manager',
          to: 'jane@example.com',
          toName: 'Jane Smith',
          subject: 'Re: Leave Request',
          content: 'Your leave request has been approved. Please coordinate with your team.',
          timestamp: '2024-01-02T16:45:00Z',
          read: true,
          type: 'sent'
        }
      ];
      setMessages(mockMessages);
      setMessage('Messages loaded successfully');
    } catch (error) {
      setMessage('Failed to load messages');
    }
    setLoading(false);
  };

  const loadEmployees = async () => {
    try {
      // TODO: Load employees from API
      // For now, using mock data
      const mockEmployees = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Failed to load employees');
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
      // TODO: Implement send message API
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
      // TODO: Implement mark as read API
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
      // TODO: Implement delete message API
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

      {/* Compose Message Form */}
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

      {/* Message Layout */}
      <div className="message-layout">
        {/* Conversation List */}
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

        {/* Message Detail */}
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

      {/* Message Statistics */}
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