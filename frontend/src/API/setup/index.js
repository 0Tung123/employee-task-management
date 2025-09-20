const API_BASE_URL = import.meta.env.VITE_API_BASE;

// Verify setup token
export const verifySetupToken = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/setup/verify-token`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Verify setup token failed:", error);
    throw error;
  }
};

// Setup employee account
export const setupAccount = async (token, password, name, phone) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/setup/setup-account`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        token, 
        password,
        ...(name && { name }),
        ...(phone && { phone })
      }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Setup account failed:", error);
    throw error;
  }
};