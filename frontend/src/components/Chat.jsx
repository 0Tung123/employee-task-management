import React, { useState, useEffect, useCallback } from 'react';
import { getConversations, getConversation, sendMessage } from '../API/messages';
import { getUserData } from '../API/auth';
import ConversationList from './ConversationList';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';
import socket, { updateSocketAuth } from '../API/socket';
import '../styles/Chat.css';

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [autoSelectUserId, setAutoSelectUserId] = useState(null);
  
  const userData = getUserData();
  

  const updateConversationsTimeoutRef = React.useRef(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      updateSocketAuth(token);
    }
  }, []);


  useEffect(() => {
    loadConversations();
    

    return () => {
      if (updateConversationsTimeoutRef.current) {
        clearTimeout(updateConversationsTimeoutRef.current);
      }
    };
  }, []);

  const loadMessages = useCallback(async (otherUserId, lastMessageId = null) => {
    try {
      setMessagesLoading(true);
      setError('');
      
      const response = await getConversation(otherUserId, lastMessageId);
      if (response.success) {
        if (lastMessageId) {

          setMessages(prev => [...response.messages, ...prev]);
        } else {

          setMessages(response.messages);
        }
        
        setHasMoreMessages(response.messages.length === 50);
      } else {
        setError('Failed to load messages');
      }
    } catch (err) {

      setError('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  }, []);


  useEffect(() => {
    if (autoSelectUserId && conversations.length > 0) {
      const conversationToSelect = conversations.find(c => c.otherUserId === autoSelectUserId);
      if (conversationToSelect) {
        setSelectedConversation(conversationToSelect);
        
        // Join socket room for this conversation
        socket.emit('join_conversation', conversationToSelect.otherUserId);
        
        // Load messages for this conversation
        loadMessages(conversationToSelect.otherUserId);
        
        setAutoSelectUserId(null); // Clear the pending selection
      }
    }
  }, [conversations, autoSelectUserId, loadMessages]);

  // Socket event listeners
  useEffect(() => {
    const handleNewMessage = (message) => {

      
      // Determine who is the "other" person in this message
      const myUserId = userData?.userId || userData?.id;
      const isMessageToMe = message.toId === myUserId;
      const isMessageFromMe = message.fromId === myUserId;
      
      if (isMessageToMe) {
        // Message is FOR me - from someone else
        const otherPersonId = message.fromId;

        
        // Find or create conversation with this person
        setConversations(prevConvs => {
          let existingConv = prevConvs.find(c => c.otherUserId === otherPersonId);
          
          if (!existingConv) {
            existingConv = {
              conversationId: `conv_${otherPersonId}`, // Add conversationId
              otherUserId: otherPersonId,
              otherUserName: message.fromType === 'owner' ? 'Owner' : 'Employee',
              lastMessage: message.text,
              lastMessageTime: message.timestamp
            };
            return [...prevConvs, existingConv];
          } else {
            return prevConvs.map(c => 
              c.otherUserId === otherPersonId 
                ? { ...c, lastMessage: message.text, lastMessageTime: message.timestamp }
                : c
            );
          }
        });
        
        // Auto-select this conversation if not already selected
        if (!selectedConversation || selectedConversation.otherUserId !== otherPersonId) {
          // Use a ref to track who we want to select for useEffect
          setAutoSelectUserId(otherPersonId);
        }
        
        // Add message to chat
        setMessages(prev => [...prev, message]);
        
      } else if (isMessageFromMe) {
        // Message is FROM me - update if it matches current conversation
        if (selectedConversation && selectedConversation.otherUserId === message.toId) {
          setMessages(prev => [...prev, message]);
        }
      }
      
      // Update conversations list with debounce
      debouncedUpdateConversations();
    };

    const handleMessageSent = (message) => {
      // Message already added optimistically, just update conversations
      debouncedUpdateConversations();
    };

    const handleMessageError = (error) => {
      console.error('Message error:', error);
      setError(error.error || 'Failed to send message');
    };

    const handleUserTyping = (data) => {
      if (selectedConversation && data.fromId === selectedConversation.otherUserId) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            // Add user to typing list if not already there
            if (!prev.find(u => u.fromId === data.fromId)) {
              return [...prev, data];
            }
            return prev;
          } else {
            // Remove user from typing list
            return prev.filter(u => u.fromId !== data.fromId);
          }
        });
      }
    };

    // Add socket listeners
    socket.on('new_message', handleNewMessage);
    socket.on('message_sent', handleMessageSent);
    socket.on('message_error', handleMessageError);
    socket.on('user_typing_message', handleUserTyping);

    // Cleanup
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_sent', handleMessageSent);
      socket.off('message_error', handleMessageError);
      socket.off('user_typing_message', handleUserTyping);
    };
  }, [selectedConversation?.otherUserId]); // Only re-run when conversation ID changes

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getConversations();
      
      if (response.success) {
        setConversations(response.conversations);
      } else {
        console.error('Failed to load conversations:', response.error);
        setError('Failed to load conversations');
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedUpdateConversations = useCallback(() => {
    if (updateConversationsTimeoutRef.current) {
      clearTimeout(updateConversationsTimeoutRef.current);
    }
    
    updateConversationsTimeoutRef.current = setTimeout(async () => {
      try {
        setError('');
        const response = await getConversations();
        if (response.success) {
          setConversations(response.conversations);
        } else {
          setError('Failed to load conversations');
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('Failed to load conversations');
      }
    }, 500); // 500ms debounce
  }, []); // Empty dependency to prevent infinite loop

  const handleConversationSelect = useCallback((conversation) => {
    try {
      // Clear any existing errors
      setError('');
      
      setSelectedConversation(conversation);
      setMessages([]);
      setTypingUsers([]);
      setHasMoreMessages(true);
      
      // Join conversation room
      socket.emit('join_conversation', conversation.otherUserId);
      
      // Check if this is a new conversation
      if (conversation.conversationId.startsWith('new_')) {
        // For new conversations, just set empty messages
        setMessages([]);
        
        // Add the new conversation to conversations array so it shows in the list
        setConversations(prevConvs => {
          // Check if conversation already exists
          const exists = prevConvs.find(c => c.otherUserId === conversation.otherUserId);
          if (!exists) {
            const newConversation = {
              ...conversation,
              conversationId: `conv_${conversation.otherUserId}`, // Change ID to non-new format
              lastMessage: '',
              lastMessageTime: new Date().toISOString()
            };
            return [...prevConvs, newConversation];
          }
          return prevConvs;
        });
        
        // Update selectedConversation with the new conversationId
        setSelectedConversation(prev => ({
          ...prev,
          conversationId: `conv_${conversation.otherUserId}`
        }));
        
      } else {

        // Load messages for existing conversation
        loadMessages(conversation.otherUserId);
      }
      
    } catch (err) {
      console.error('Error in handleConversationSelect:', err);
      setError(`Failed to select conversation: ${err.message}`);
    }
  }, [loadMessages]);

  const handleSendMessage = async (text) => {
    if (!selectedConversation || !text.trim()) return;

    try {
      // Add message optimistically to UI
      const tempMessage = {
        id: 'temp-' + Date.now(),
        fromId: userData?.userId || userData?.id,
        toId: selectedConversation.otherUserId,
        text: text.trim(),
        timestamp: new Date().toISOString(),
        fromType: userData?.userType || userData?.role?.toLowerCase()
      };
      
      setMessages(prev => [...prev, tempMessage]);

      // Send via Socket.io for real-time delivery
      socket.emit('private_message', {
        toId: selectedConversation.otherUserId,
        text: text.trim()
      });

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const handleTyping = (isTyping) => {
    if (selectedConversation) {
      socket.emit('typing_message', {
        toId: selectedConversation.otherUserId,
        isTyping
      });
    }
  };

  const handleLoadMoreMessages = () => {
    if (selectedConversation && messages.length > 0 && !messagesLoading) {
      const oldestMessage = messages[0];
      loadMessages(selectedConversation.otherUserId, oldestMessage.id);
    }
  };

  try {
    return (
      <div className="chat-container">
        <ConversationList
          conversations={conversations}
          onConversationSelect={handleConversationSelect}
          selectedConversationId={selectedConversation?.conversationId}
          loading={loading}
          error={error}
        />
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
        }}>
          <MessageArea
            messages={messages}
            selectedConversation={selectedConversation}
            loading={messagesLoading}
            error={error}
            typingUsers={typingUsers}
            onLoadMore={handleLoadMoreMessages}
            hasMore={hasMoreMessages}
          />
          
          <MessageInput
            onSendMessage={selectedConversation ? handleSendMessage : null}
            onTyping={selectedConversation ? handleTyping : null}
            placeholder={
              selectedConversation 
                ? `Message ${selectedConversation.otherUserName || 'User'}...`
                : "Select a conversation to start messaging..."
            }
            disabled={!selectedConversation}
          />
        </div>
      </div>
    );
  } catch (err) {
    console.error('Fatal error in Chat component render:', err);
    return (
      <div className="chat-container" style={{ padding: '20px', textAlign: 'center' }}>
        <div className="chat-error">
          <h3>Chat Error</h3>
          <p>Something went wrong with the chat. Please refresh the page.</p>
          <p style={{ fontSize: '12px', color: '#666' }}>Error: {err.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default Chat;