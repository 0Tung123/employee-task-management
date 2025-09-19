const API_BASE_URL = import.meta.env.VITE_API_BASE;

// Owner Login (SMS)
export const ownerLogin = async (phoneNumber, otp) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/owner/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phoneNumber, otp }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const result = await response.json();
    
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));
    }
    
    return result;
  } catch (error) {
    console.error("Owner login failed:", error);
    throw error;
  }
};

// Employee Login (Email)
export const employeeLogin = async (email, otp) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/employee/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, otp }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const result = await response.json();
    
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));
    }
    
    return result;
  } catch (error) {
    console.error("Employee login failed:", error);
    throw error;
  }
};

// Send OTP for Owner
export const sendOwnerOTP = async (phoneNumber) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/owner/send-otp`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phoneNumber }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Send owner OTP failed:", error);
    throw error;
  }
};

// Send OTP for Employee
export const sendEmployeeOTP = async (email) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/employee/send-otp`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Send employee OTP failed:", error);
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

// Get current user role
export const getUserRole = () => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  return userData.role || null;
};