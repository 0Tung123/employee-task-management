const API_BASE_URL = import.meta.env.VITE_API_BASE;

export const setSchedule = async (scheduleData) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/api/owner/SetSchedule`, {
      method: 'POST',
      headers,
      body: JSON.stringify(scheduleData),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Set schedule failed:", error);
    throw error;
  }
};

export const getEmployeeSchedules = async (employeeId, startDate, endDate) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const body = { employeeId };
    if (startDate) body.startDate = startDate;
    if (endDate) body.endDate = endDate;
    const response = await fetch(`${API_BASE_URL}/api/owner/GetEmployeeSchedules`, {
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

