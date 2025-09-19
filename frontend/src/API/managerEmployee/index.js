const API_BASE_URL = import.meta.env.VITE_API_BASE;

// === EMPLOYEE MANAGEMENT ===

// Get all employees
export const getAllEmployees = async () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/owner/employees`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Get all employees failed:", error);
    throw error;
  }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/owner/employees/${id}`, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Get employee by ID failed:", error);
    throw error;
  }
};

// Create new employee
export const createEmployee = async (employeeData) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/owner/employees`, {
      method: 'POST',
      headers,
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Create employee failed:", error);
    throw error;
  }
};

// Update employee
export const updateEmployee = async (id, employeeData) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/owner/employees/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Update employee failed:", error);
    throw error;
  }
};

// Delete employee
export const deleteEmployee = async (id) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  try {
    const response = await fetch(`${API_BASE_URL}/owner/employees/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return await response.json();
  } catch (error) {
    console.error("Delete employee failed:", error);
    throw error;
  }
};

