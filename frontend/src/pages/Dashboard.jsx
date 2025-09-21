import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, ChevronDown, Users, UserPlus, Calendar, BarChart3 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import { NotificationContainer } from '../components/Notification';
import ConfirmDialog from '../components/ConfirmDialog';
import useNotification from '../hooks/useNotification';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../API/owner';
import { getUserRole, logout } from '../API/auth';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, employee: null });
  const navigate = useNavigate();
  const { notifications, removeNotification, showSuccess, showError, showWarning } = useNotification();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const userRole = getUserRole();
        if (!userRole) {
          navigate('/login-email');
          return;
        }

        const response = await getAllEmployees();
        if (response.success) {
          setEmployees(response.employees);
        } else {
          showError('Failed to load employees');
        }
      } catch (err) {
        showError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  useEffect(() => {
    const filtered = employees.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const handleCreateEmployee = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCreate = async (employeeData) => {
    try {
      const response = await createEmployee(employeeData);
      if (response.success) {
        setShowCreateModal(false);
        showSuccess('Employee created successfully');
        const res = await getAllEmployees();
        if (res.success) {
          setEmployees(res.employees);
        }
      } else {
        showError('Failed to create employee');
      }
    } catch (err) {
      showError('Error creating employee');
    }
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (employeeData) => {
    try {
      const response = await updateEmployee(editingEmployee.id, employeeData);
      if (response.success) {
        setShowEditModal(false);
        setEditingEmployee(null);
        showSuccess('Employee updated successfully');
        const res = await getAllEmployees();
        if (res.success) {
          setEmployees(res.employees);
        }
      } else {
        showError('Failed to update employee');
      }
    } catch (err) {
      showError('Error updating employee');
    }
  };

  const handleDeleteEmployee = (employee) => {
    setConfirmDialog({
      isOpen: true,
      employee: employee
    });
  };

  const confirmDeleteEmployee = async () => {
    const employee = confirmDialog.employee;
    setConfirmDialog({ isOpen: false, employee: null });

    try {
      const response = await deleteEmployee(employee.id);
      if (response.success) {
        const res = await getAllEmployees();
        if (res.success) {
          setEmployees(res.employees);
        }
        showSuccess(`${employee.name} has been successfully deleted.`);
      } else {
        showError(`Failed to delete employee: ${response.error || 'Unknown error'}`);
      }
    } catch (err) {
      showError('Error deleting employee. Please try again.');
    }
  };

  const cancelDeleteEmployee = () => {
    setConfirmDialog({ isOpen: false, employee: null });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    showSuccess('Logged out successfully');
    navigate('/login-email');
  };

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === 'active').length,
    pendingTasks: 0,
    completedTasks: 0
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Employee Management</h1>
              <p className="page-subtitle">Manage your team effectively</p>
            </div>
            <div className="header-actions">
              <button className="header-btn">
                <Bell size={20} />
              </button>
              <div className="avatar-dropdown-container">
                <button className="avatar-btn" onClick={toggleDropdown}>
                  <User size={24} />
                  <ChevronDown size={16} />
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users size={24} color="#2563eb" />
              </div>
              <div className="stat-content">
                <h3>{stats.totalEmployees}</h3>
                <p>Total Employees</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <UserPlus size={24} color="#059669" />
              </div>
              <div className="stat-content">
                <h3>{stats.activeEmployees}</h3>
                <p>Active Employees</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Calendar size={24} color="#dc2626" />
              </div>
              <div className="stat-content">
                <h3>{stats.pendingTasks}</h3>
                <p>Pending Tasks</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <BarChart3 size={24} color="#7c3aed" />
              </div>
              <div className="stat-content">
                <h3>{stats.completedTasks}</h3>
                <p>Completed Tasks</p>
              </div>
            </div>
          </div>
        </section>

        <div className="content">
          <div className="content-header">
            <h2>Employee List</h2>
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search size={18} color="#6b7280" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button className="create-btn" onClick={handleCreateEmployee}>
                <UserPlus size={16} />
                Add Employee
              </button>
            </div>
          </div>
          {loading ? (
            <div className="loading-state">
              <p>Loading employees...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <Users size={48} color="#9ca3af" />
              <p>No employees found</p>
            </div>
          ) : (
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          )}
        </div>
        {showCreateModal && (
          <EmployeeModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleSubmitCreate}
          />
        )}
        {showEditModal && editingEmployee && (
          <EmployeeModal
            employee={editingEmployee}
            isEdit={true}
            onClose={() => {
              setShowEditModal(false);
              setEditingEmployee(null);
            }}
            onSubmit={handleSubmitEdit}
          />
        )}
        
        <NotificationContainer 
          notifications={notifications} 
          removeNotification={removeNotification} 
        />
        
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Delete Employee"
          message={`Are you sure you want to delete ${confirmDialog.employee?.name}? This action cannot be undone and will permanently remove the employee and all their associated data.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={confirmDeleteEmployee}
          onCancel={cancelDeleteEmployee}
        />
      </main>
    </div>
  );
};

export default Dashboard;