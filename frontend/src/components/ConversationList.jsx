import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getAllEmployees } from '../API/owner';
import { getUserData } from '../API/auth';

const ConversationList = ({ 
  conversations, 
  onConversationSelect, 
  selectedConversationId, 
  loading,
  error 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userMap, setUserMap] = useState({});
  const userData = getUserData();
  const isOwner = userData?.role === 'Owner';

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        
        if (isOwner) {
          const response = await getAllEmployees();
          
          if (response.success) {
            const map = {};
            response.employees.forEach(emp => {
              map[emp.id] = {
                name: emp.name,
                email: emp.email,
                role: 'Employee'
              };
            });

            setUserMap(map);
          }
        } else {
          setUserMap({});
        }
      } catch (error) {
      }
    };

    fetchUserData();
  }, [isOwner]);

  useEffect(() => {
    if (!isOwner && conversations.length > 0) {
      setUserMap(prevUserMap => {
        const newUserMap = { ...prevUserMap };
        let hasChanges = false;
        
        conversations.forEach(conv => {
          if (!newUserMap[conv.otherUserId]) {
            newUserMap[conv.otherUserId] = {
              name: conv.otherUserName || 'Owner',
              email: '',
              role: 'Owner'
            };
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          return newUserMap;
        }
        return prevUserMap;
      });
    }
  }, [conversations, isOwner]);

  const filteredConversations = conversations.filter(conv => {
    try {
      const user = userMap[conv.otherUserId];
      if (!user) {
        return false;
      }
      
      const searchLower = searchTerm.toLowerCase();
      const userNameMatch = user.name?.toLowerCase().includes(searchLower);
      const userEmailMatch = user.email?.toLowerCase().includes(searchLower);
      const messageMatch = conv.lastMessage?.toLowerCase().includes(searchLower);
      
      return userNameMatch || userEmailMatch || messageMatch;
    } catch (err) {
      return false;
    }
  });

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Now';
    } else if (diffInHours < 24) {
      return messageTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return 'UN'; // Unknown
    }
    
    return name
      .trim()
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="conversation-list">
        <div className="conversation-list-header">
          <h3>Messages</h3>
        </div>
        <div className="conversations-loading">
          <p>Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversation-list">
        <div className="conversation-list-header">
          <h3>Messages</h3>
        </div>
        <div className="chat-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h3>Messages</h3>
        <div className="conversation-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="conversations-scroll">
        {filteredConversations.length === 0 && isOwner && Object.keys(userMap).length > 0 && !selectedConversationId ? (
          <div>
            <div className="section-header" style={{ padding: '10px 20px', borderBottom: '1px solid #e5e7eb' }}>
              <h4 style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Start conversation</h4>
            </div>
            {Object.keys(userMap).length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                <p>No employees found.</p>
                <p style={{ fontSize: '12px' }}>Create employees first from the Employee Management page.</p>
              </div>
            ) : (
              Object.entries(userMap).map(([userId, user]) => {
              if (userId === userData?.userId || userId === userData?.id) return null;
              
              return (
                <div
                  key={userId}
                  className="conversation-item"
                  onClick={() => onConversationSelect({
                    conversationId: `new_${userId}`,
                    otherUserId: userId,
                    otherUserName: user.name,
                    otherUserType: user.role === 'Owner' ? 'owner' : 'employee',
                    lastMessage: 'Start conversation',
                    timestamp: new Date().toISOString(),
                    read: true
                  })}
                >
                  <div className="conversation-avatar">
                    {getInitials(user.name)}
                  </div>
                  <div className="conversation-info">
                    <h4 className="conversation-name">{user.name}</h4>
                    <p className="conversation-preview" style={{ color: '#6b7280' }}>
                      Click to start conversation
                    </p>
                  </div>
                  <div className="conversation-meta">
                    <span className="conversation-time">New</span>
                  </div>
                </div>
              );
            }))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="chat-empty-state" style={{ padding: '40px 20px' }}>
            <Search size={48} color="#9ca3af" />
            <h3>No conversations</h3>
            <p>{searchTerm ? 'No results found' : 'Start a conversation'}</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            try {
              const user = userMap[conversation.otherUserId];
              if (!user) {
                return null;
              }

              return (
                <div
                  key={conversation.conversationId}
                  className={`conversation-item ${
                    selectedConversationId === conversation.conversationId ? 'active' : ''
                  }`}
                  onClick={() => {
                    try {
                      onConversationSelect(conversation);
                    } catch (err) {
                    }
                  }}
                >
                  <div className="conversation-avatar">
                    {getInitials(user.name || 'Unknown')}
                  </div>
                  <div className="conversation-info">
                    <h4 className="conversation-name">{user.name || 'Unknown User'}</h4>
                    <p className="conversation-preview">
                      {conversation.lastMessage || ''}
                    </p>
                  </div>
                  <div className="conversation-meta">
                    <span className="conversation-time">
                      {formatTime(conversation.timestamp || new Date().toISOString())}
                    </span>
                    {!conversation.read && (
                      <span className="unread-badge">●</span>
                    )}
                  </div>
                </div>
              );
            } catch (err) {
              return null;
            }
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;