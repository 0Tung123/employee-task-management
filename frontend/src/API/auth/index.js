const API_BASE_URL = import.meta.env.VITE_API_BASE;

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
    throw error;
  }
};

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
    throw error;
  }
};

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
    throw error;
  }
};

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
    throw error;
  }
};

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
    throw error;
  }
};

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
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export const getUserRole = () => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  return userData.role || null;
};