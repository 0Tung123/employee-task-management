const API_BASE_URL = import.meta.env.VITE_API_BASE;

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
    throw error;
  }
};

export const setupAccount = async (token, password, username, name, phone) => {
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
        ...(username && { username }),
        ...(name && { name }),
        ...(phone && { phone })
      }),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};