const API_BASE_URL = import.meta.env.VITE_API_BASE;

// Send SMS OTP for Owner
export const sendOwnerOTP = async (phoneNumber) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/CreateNewAccessCode`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ phone: phoneNumber }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Send owner OTP failed:", error);
    throw error;
  }
};

// Validate OTP for Owner
export const validateOwnerOTP = async (phoneNumber, otp) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/ValidateAccessCode`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ identifier: phoneNumber, otp }),
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
    console.error("Validate owner OTP failed:", error);
    throw error;
  }
};

// Send Email OTP for Employee
export const sendEmployeeOTP = async (email) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/LoginEmail`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Send employee OTP failed:", error);
    throw error;
  }
};

// Validate OTP for Employee
export const validateEmployeeOTP = async (email, otp) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/ValidateAccessCode`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ identifier: email, otp }),
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
    console.error("Validate employee OTP failed:", error);
    throw error;
  }
};

// Send Signup OTP for Employee (same as sendEmployeeOTP for now)
export const sendSignupOTP = async (email) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/LoginEmail`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Send signup OTP failed:", error);
    throw error;
  }
};

// Validate Signup OTP for Employee (same as validateEmployeeOTP for now)
export const validateSignupOTP = async (email, otp) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/ValidateAccessCode`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ identifier: email, otp }),
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
    console.error("Validate signup OTP failed:", error);
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