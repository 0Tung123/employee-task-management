import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from '../API/auth/OwnerApi';
import Input from '../components/Input';
import Button from '../components/Button';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (error) {
      setMessage('Failed to fetch employees');
    }
  };

  const handleAddEmployee = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await createEmployee(formData);
      if (data.id) {
        setEmployees([...employees, data]);
        setFormData({ name: '', phone: '', email: '', role: '' });
        setShowAddForm(false);
        setMessage('Employee added successfully');
      } else {
        setMessage(data.error || 'Failed to add employee');
      }
    } catch (error) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  const handleEditEmployee = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await updateEmployee(editingEmployee.id, formData);
      if (data.id) {
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? data : emp));
        setEditingEmployee(null);
        setFormData({ name: '', phone: '', email: '', role: '' });
        setMessage('Employee updated successfully');
      } else {
        setMessage(data.error || 'Failed to update employee');
      }
    } catch (error) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  const handleDeleteEmployee = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    setLoading(true);
    setMessage('');
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter(emp => emp.id !== id));
      setMessage('Employee deleted successfully');
    } catch (error) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  const startEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      phone: employee.phone,
      email: employee.email,
      role: employee.role,
    });
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingEmployee(null);
    setFormData({ name: '', phone: '', email: '', role: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('phoneNumber');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <h1>Employee Management Dashboard</h1>
      <div className="header-buttons">
        <Button onClick={handleLogout} className="logout-btn">Logout</Button>
        <Button onClick={() => setShowAddForm(true)} className="add-btn">Add Employee</Button>
      </div>
      {message && <p className={`message ${message.includes('success') ? 'success' : ''}`}>{message}</p>}
      {(showAddForm || editingEmployee) && (
        <div className="form-section">
          <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
          <div className="form-grid">
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>
          <div className="form-buttons">
            <Button onClick={editingEmployee ? handleEditEmployee : handleAddEmployee} disabled={loading}>
              {loading ? 'Saving...' : editingEmployee ? 'Update' : 'Add'}
            </Button>
            <Button onClick={cancelForm} className="cancel-btn">Cancel</Button>
          </div>
        </div>
      )}
      <h2>Employees</h2>
      <ul className="employees-list">
        {employees.map(emp => (
          <li key={emp.id} className="employee-item">
            <strong>{emp.name}</strong> - {emp.phone} - {emp.email} - {emp.role}
            <div className="actions">
              <Button onClick={() => startEdit(emp)} className="edit-btn">Edit</Button>
              <Button onClick={() => handleDeleteEmployee(emp.id)} className="delete-btn">Delete</Button>
            </div>
            {emp.schedules && emp.schedules.length > 0 && (
              <div className="schedules">
                <h4>Schedules</h4>
                {emp.schedules.map((sch, idx) => (
                  <p key={idx}>{sch.days} - {sch.hours}</p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;