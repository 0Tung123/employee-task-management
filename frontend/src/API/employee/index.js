const API_BASE_URL = import.meta.env.VITE_API_BASE;

export const getEmployeeProfile = async () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/employee/profile`, {
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

export const getEmployeeSchedules = async (startDate, endDate) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const body = {};
    if (startDate) body.startDate = startDate;
    if (endDate) body.endDate = endDate;
    const response = await fetch(`${API_BASE_URL}/api/employee/GetMySchedules`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
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

export const updateEmployeeProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/employee/profile`, {
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