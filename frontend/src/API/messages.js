import { apiRequest } from './auth';

const API_BASE = '/api/messages';

// Send a message
export const sendMessage = async (toId, text) => {
  return await apiRequest(`${API_BASE}/send`, {
    method: 'POST',
    body: JSON.stringify({ toId, text })
  });
};

// Get conversation with another user
export const getConversation = async (otherUserId, lastMessageId = null) => {
  const params = new URLSearchParams();
  if (lastMessageId) {
    params.append('lastMessageId', lastMessageId);
  }
  
  const url = `${API_BASE}/conversation/${otherUserId}${params.toString() ? `?${params.toString()}` : ''}`;
  return await apiRequest(url);
};

// Get all conversations for current user
export const getConversations = async () => {
  return await apiRequest(`${API_BASE}/conversations`);
};

// Mark message as read
export const markAsRead = async (messageId) => {
  return await apiRequest(`${API_BASE}/mark-read/${messageId}`, {
    method: 'PATCH'
  });
};

// Get unread messages count
export const getUnreadCount = async () => {
  return await apiRequest(`${API_BASE}/unread-count`);
};