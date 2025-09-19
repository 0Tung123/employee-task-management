const employeeService = require('../services/employeeManagementService');

const GetEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: 'Employee ID is required'
      });
    }
    const employee = await employeeService.getEmployeeById(employeeId);
    res.json({
      success: true,
      message: 'Employee retrieved successfully',
      employee: employee
    });
  } catch (error) {
    if (error.message === 'Employee not found') {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to get employee'
    });
  }
};

const GetAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json({
      success: true,
      message: 'Employees retrieved successfully',
      count: employees.length,
      employees: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get employees'
    });
  }
};

const CreateEmployee = async (req, res) => {
  try {
    const { name, email, phone, department, position } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    const employeeData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      department: department?.trim() || '',
      position: position?.trim() || ''
    };
    const newEmployee = await employeeService.createEmployee(employeeData);
    res.status(201).json({
      success: true,
      message: 'Employee created successfully and welcome email sent',
      employee: newEmployee
    });
  } catch (error) {
    if (error.message === 'Employee with this email already exists') {
      return res.status(409).json({
        success: false,
        error: 'Employee with this email already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create employee'
    });
  }
};

const UpdateEmployee = async (req, res) => {
  try {
    const { employeeId, name, email, phone, department, position, isActive } = req.body;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: 'Employee ID is required'
      });
    }
    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format'
        });
      }
      updateData.email = email.toLowerCase().trim();
    }
    if (phone !== undefined) updateData.phone = phone.trim();
    if (department !== undefined) updateData.department = department.trim();
    if (position !== undefined) updateData.position = position.trim();
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    const updatedEmployee = await employeeService.updateEmployee(employeeId, updateData);
    res.json({
      success: true,
      message: 'Employee updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    if (error.message === 'Employee not found') {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    if (error.message === 'Another employee with this email already exists') {
      return res.status(409).json({
        success: false,
        error: 'Another employee with this email already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update employee'
    });
  }
};

const DeleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: 'Employee ID is required'
      });
    }
    const result = await employeeService.deleteEmployee(employeeId);
    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    if (error.message === 'Employee not found') {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to delete employee'
    });
  }
};

const SetSchedule = async (req, res) => {
  try {
    const { employeeId, date, startTime, endTime, breakDuration, notes } = req.body;
    if (!employeeId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Employee ID, date, start time, and end time are required'
      });
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Date must be in YYYY-MM-DD format'
      });
    }
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        error: 'Time must be in HH:MM format (24-hour)'
      });
    }
    const scheduleData = {
      date,
      startTime,
      endTime,
      breakDuration: parseInt(breakDuration) || 0,
      notes: notes?.trim() || ''
    };
    const schedule = await employeeService.setEmployeeSchedule(employeeId, scheduleData);
    res.status(201).json({
      success: true,
      message: 'Schedule set successfully',
      schedule: schedule
    });
  } catch (error) {
    if (error.message === 'Employee not found') {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to set schedule'
    });
  }
};

const GetEmployeeSchedules = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.body;
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        error: 'Employee ID is required'
      });
    }
    const schedules = await employeeService.getEmployeeSchedules(employeeId, startDate, endDate);
    res.json({
      success: true,
      message: 'Schedules retrieved successfully',
      count: schedules.length,
      schedules: schedules
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get schedules'
    });
  }
};

module.exports = {
  GetEmployee,
  GetAllEmployees,
  CreateEmployee,
  UpdateEmployee,
  DeleteEmployee,
  SetSchedule,
  GetEmployeeSchedules
};