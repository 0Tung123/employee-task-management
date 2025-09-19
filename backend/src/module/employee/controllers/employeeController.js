const employeeService = require('../services/employeeService');

const createEmployee = async (req, res) => {
  try {
    const { name, phone, email, role } = req.body;
    if (!name || !phone || !email || !role) {
      return res.status(400).json({ error: 'Name, phone, email, and role are required' });
    }
    const employee = await employeeService.createEmployee({ name, phone, email, role });
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Error getting employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);
    res.json(employee);
  } catch (error) {
    console.error('Error getting employee:', error);
    if (error.message === 'Employee not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const employee = await employeeService.updateEmployee(id, updateData);
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await employeeService.deleteEmployee(id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = req.body;
    await employeeService.addSchedule(id, schedule);
    res.json({ message: 'Schedule added successfully' });
  } catch (error) {
    console.error('Error adding schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { id, scheduleIndex } = req.params;
    const schedule = req.body;
    await employeeService.updateSchedule(id, parseInt(scheduleIndex), schedule);
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id, scheduleIndex } = req.params;
    await employeeService.deleteSchedule(id, parseInt(scheduleIndex));
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  addSchedule,
  updateSchedule,
  deleteSchedule,
};