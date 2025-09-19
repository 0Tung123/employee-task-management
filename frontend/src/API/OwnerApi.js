const API_BASE = import.meta.env.VITE_API_BASE;

export const sendAccessCode = async (phoneNumber) => {
  const response = await fetch(`${API_BASE}/sms/create-access-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  });
  return response.json();
};

export const validateAccessCode = async (phoneNumber, accessCode) => {
  const response = await fetch(`${API_BASE}/sms/validate-access-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, accessCode }),
  });
  return response.json();
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