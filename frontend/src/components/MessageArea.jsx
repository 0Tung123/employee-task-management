import React, { useState, useEffect, useRef } from 'react';
import { getUserData } from '../API/auth';

const MessageArea = ({ 
  messages, 
  selectedConversation,
  loading,
  error,
  typingUsers,
  onLoadMore,
  hasMore
}) => {
  const [userMap, setUserMap] = useState({});
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const userData = getUserData();

  useEffect(() => {
    // Build user map from conversation data and current user
    const map = {};
    
    // Add current user
    const currentUserId = userData?.userId || userData?.id;
    if (currentUserId) {
      map[currentUserId] = {
        name: userData?.name || 'You',
        role: userData?.role
      };
    }

    // Add other user from conversation
    const otherUserId = selectedConversation?.otherUserId;
    if (otherUserId) {
      // This would typically come from an API call to get user details
      // For now, we'll use basic info
      map[otherUserId] = {
        name: selectedConversation?.otherUserName || 
              (selectedConversation?.otherUserType === 'owner' ? 'Owner' : 'Employee'),
        role: selectedConversation?.otherUserType === 'owner' ? 'Owner' : 'Employee'
      };
    }

    setUserMap(map);
  }, [userData?.userId, userData?.id, userData?.name, userData?.role, 
      selectedConversation?.otherUserId, selectedConversation?.otherUserName, 
      selectedConversation?.otherUserType]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive, but only if user was already near bottom
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // Always scroll to bottom for first message or when user is near bottom
      if (messages.length === 1 || isNearBottom) {
        setTimeout(() => scrollToBottom(), 50); // Small delay to ensure DOM is updated
      }
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateSeparator = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const shouldShowDateSeparator = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return currentDate !== previousDate;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!selectedConversation) {
    return (
      <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
        }}>
          {/* DEBUG: Check if this renders */}
        <div className="chat-empty-state">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3>Select a conversation</h3>
          <p>Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  if (loading && messages.length === 0) {
    return (
      <>
        <div className="chat-header">
          <div className="chat-user-avatar">
            {getInitials(userMap[selectedConversation.otherUserId]?.name || 'User')}
          </div>
          <div className="chat-user-info">
            <h4>{userMap[selectedConversation.otherUserId]?.name || 'User'}</h4>
            <p className="chat-user-status">
              {userMap[selectedConversation.otherUserId]?.role || 'User'}
            </p>
          </div>
        </div>
        <div className="messages-loading">
          <p>Loading messages...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="chat-area">
        <div className="chat-header">
          <div className="chat-user-avatar">
            {getInitials(userMap[selectedConversation.otherUserId]?.name || 'User')}
          </div>
          <div className="chat-user-info">
            <h4>{userMap[selectedConversation.otherUserId]?.name || 'User'}</h4>
            <p className="chat-user-status">
              {userMap[selectedConversation.otherUserId]?.role || 'User'}
            </p>
          </div>
        </div>
        <div className="chat-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div className="chat-user-avatar">
          {getInitials(userMap[selectedConversation.otherUserId]?.name || 'User')}
        </div>
        <div className="chat-user-info">
          <h4>{userMap[selectedConversation.otherUserId]?.name || 'User'}</h4>
          <p className="chat-user-status">
            {userMap[selectedConversation.otherUserId]?.role || 'User'}
          </p>
        </div>
      </div>

      <div 
        className="messages-area" 
        ref={messagesContainerRef}
        onScroll={(e) => {
          // Load more messages when scrolled near top
          if (e.target.scrollTop < 50 && hasMore && !loading) {
            onLoadMore && onLoadMore();
          }
          
          // Show/hide scroll to bottom button
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
          setShowScrollButton(!isNearBottom);
        }}
      >
        {loading && messages.length > 0 && (
          <div style={{ textAlign: 'center', padding: '10px', color: '#6b7280' }}>
            Loading more messages...
          </div>
        )}

        {messages.map((message, index) => {
          const isOwn = message.fromId === (userData?.userId || userData?.id);
          const showDateSeparator = shouldShowDateSeparator(message, messages[index - 1]);
          
          return (
            <React.Fragment key={message.id}>
              {showDateSeparator && (
                <div style={{
                  textAlign: 'center',
                  margin: '20px 0',
                  color: '#9ca3af',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {formatDateSeparator(message.timestamp)}
                </div>
              )}
              
              <div className={`message-group ${isOwn ? 'own' : 'other'}`}>
                <div className={`message ${isOwn ? 'own' : 'other'}`}>
                  {message.text}
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {/* Typing indicator */}
        {typingUsers.map(user => (
          <div key={user.fromId} className="message-group other">
            <div className="typing-indicator">
              <span>{userMap[user.fromId]?.name || 'User'} is typing</span>
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} style={{ height: '1px', minHeight: '1px' }} />
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          className="scroll-to-bottom-btn"
          onClick={scrollToBottom}
          title="Scroll to bottom"
        >
          ↓
        </button>
      )}
    </div>
  );
};

export default MessageArea;