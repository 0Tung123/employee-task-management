const API_BASE_URL = import.meta.env.VITE_API_BASE;

// Get all employees
export const getAllEmployees = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/owner/employees`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    return { success: false, error: 'Network error' };
  }
};

// Create employee
export const createEmployee = async (employeeData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/owner/CreateEmployee`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeeData)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: 'Network error' };
  }
};

// Update employee
export const updateEmployee = async (employeeId, employeeData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/owner/UpdateEmployee`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ employeeId, ...employeeData })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating employee:', error);
    return { success: false, error: 'Network error' };
  }
};

// Delete employee
export const deleteEmployee = async (employeeId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/owner/DeleteEmployee`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ employeeId })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { success: false, error: 'Network error' };
  }
};

// Get employee by ID
export const getEmployee = async (employeeId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/owner/GetEmployee`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ employeeId })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    return { success: false, error: 'Network error' };
  }
};

// Set employee schedule
export const setEmployeeSchedule = async (employeeId, scheduleData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/owner/SetSchedule`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ employeeId, ...scheduleData })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error setting schedule:', error);
    return { success: false, error: 'Network error' };
  }
};

// Get employee schedules
export const getEmployeeSchedules = async (employeeId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/owner/GetEmployeeSchedules`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ employeeId })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return { success: false, error: 'Network error' };
  }
};