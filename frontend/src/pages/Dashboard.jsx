import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import EmployeeTable from '../components/EmployeeTable';
import CreateEmployeeModal from '../components/CreateEmployeeModal';
import { getAllEmployees, createEmployee } from '../API/owner';
import { getUserRole, logout } from '../API/auth';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
          setError('Failed to load employees');
        }
      } catch (err) {
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

  const handleCreateEmployee = () => {
    setShowCreateModal(true);
  };

  const handleSubmitCreate = async (employeeData) => {
    try {
      const response = await createEmployee(employeeData);
      if (response.success) {
        setShowCreateModal(false);
        // Refresh employees
        const res = await getAllEmployees();
        if (res.success) {
          setEmployees(res.employees);
        }
      } else {
        alert('Failed to create employee');
      }
    } catch (err) {
      alert('Error creating employee');
    }
  };

  const handleEditEmployee = (employeeId) => {
    // Navigate to edit page or open modal
    alert(`Edit Employee ${employeeId} - to be implemented`);
  };

  const handleDeleteEmployee = (employeeId) => {
    // Handle delete
    alert(`Delete Employee ${employeeId} - to be implemented`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login-email');
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-right">
            <button className="icon-button">
              <Bell size={24} />
            </button>
            <div className="avatar-dropdown-container">
              <button className="avatar-placeholder" onClick={toggleDropdown}>
                <User size={32} color="#666" />
                <ChevronDown size={16} color="#666" />
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
        </header>
        <div className="content">
          <h1 className="page-title">Manage Employee</h1>
          <div className="stats-actions">
            <p className="employee-count">{employees.length} Employee</p>
            <div className="actions">
              <button className="create-button" onClick={handleCreateEmployee}>
                <span>+</span> Create Employee
              </button>
              <div className="search-filter">
                <Search size={14} />
                <input type="text" placeholder="Filter" />
              </div>
            </div>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <EmployeeTable
              employees={employees}
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          )}
        </div>
        {showCreateModal && (
          <CreateEmployeeModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleSubmitCreate}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;