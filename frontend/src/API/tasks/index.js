const API_BASE_URL = import.meta.env.VITE_API_BASE;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Create new task (Owner only)
export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

// Get tasks with filters
export const getTasks = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.assigneeId) queryParams.append('assigneeId', filters.assigneeId);
    if (filters.ownerId) queryParams.append('ownerId', filters.ownerId);
    if (filters.status) queryParams.append('status', filters.status);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/tasks${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

// Get task by ID
export const getTaskById = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

// Update task
export const updateTask = async (taskId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

// Employee marks task as done
export const markTaskAsDone = async (taskId, notes = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        status: 'done',
        notes: notes
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

// Delete task (Owner only)
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

// Get task statistics
export const getTaskStats = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.assigneeId) queryParams.append('assigneeId', filters.assigneeId);
    if (filters.ownerId) queryParams.append('ownerId', filters.ownerId);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/tasks/stats${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};