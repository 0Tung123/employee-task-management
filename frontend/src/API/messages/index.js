const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper function to handle fetch responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
};

// Send a message
export const sendMessage = async (toId, text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ toId, text })
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Get conversation with another user
export const getConversation = async (otherUserId, lastMessageId = null, limit = 50) => {
  try {
    const params = new URLSearchParams();
    if (lastMessageId) params.append('lastMessageId', lastMessageId);
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = `${API_BASE_URL}/api/messages/conversation/${otherUserId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Get all conversations for current user
export const getConversations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Mark message as read
export const markAsRead = async (messageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/mark-read/${messageId}`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Get unread messages count
export const getUnreadCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages/unread-count`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};