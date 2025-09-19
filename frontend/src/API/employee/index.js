const API_BASE_URL = import.meta.env.VITE_API_BASE;

// === EMPLOYEE PROFILE ===

// Get employee profile
export const getEmployeeProfile = async () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/employee/profile`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Get employee profile failed:", error);
    throw error;
  }
};

// Update employee profile
export const updateEmployeeProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/employee/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Update employee profile failed:", error);
    throw error;
  }
};

export const getEmployeeSchedules = async () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/employee/schedules`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Get employee schedules failed:", error);
    throw error;
  }
};

// Get specific schedule by ID
export const getEmployeeScheduleById = async (id) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/employee/schedules/${id}`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Get employee schedule by ID failed:", error);
    throw error;
  }
};