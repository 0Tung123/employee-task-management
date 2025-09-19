const API_BASE = import.meta.env.VITE_API_BASE;

export const sendAccessCode = async (phoneNumber) => {
  const response = await fetch(`${API_BASE}/sms/create-access-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  });
  return response.json();
};

export const validateAccessCode = async (phoneNumber, accessCode, name = null) => {
  const body = { phoneNumber, accessCode };
  if (name) body.name = name;

  const response = await fetch(`${API_BASE}/sms/validate-access-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  const result = await response.json();
  
  // If login successful, save token and owner info to localStorage
  if (result.success && result.token) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('phoneNumber', result.owner.phoneNumber);
    localStorage.setItem('userName', result.owner.name);
    localStorage.setItem('userRole', result.owner.role);
  }
  
  return result;
};

export const loginWithEmail = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/login-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const signupWithEmail = async (email, password) => {
  const response = await fetch(`${API_BASE}/auth/signup-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

export const fetchEmployees = async () => {
  const response = await fetch(`${API_BASE}/employees`);
  return response.json();
};

export const createEmployee = async (data) => {
  const response = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateEmployee = async (id, data) => {
  const response = await fetch(`${API_BASE}/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const deleteEmployee = async (id) => {
  const response = await fetch(`${API_BASE}/employees/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};

// Authentication utilities
export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const token = getToken();
  const phoneNumber = localStorage.getItem('phoneNumber');
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) return null;
  
  return {
    token,
    phoneNumber,
    name: userName,
    role: userRole
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('phoneNumber');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Protected API call with authentication
export const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });
  
  if (response.status === 401 || response.status === 403) {
    logout(); // Clear invalid token
    throw new Error('Authentication failed');
  }
  
  return response.json();
};