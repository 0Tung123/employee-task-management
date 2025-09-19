const API_BASE_URL = import.meta.env.VITE_API_BASE;

export const getOwnerProfile = async () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/owner/profile`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Get owner profile failed:", error);
    throw error;
  }
};

export const updateOwnerProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/owner/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Update owner profile failed:", error);
    throw error;
  }
};