import React from 'react';
import { getUserData } from '../API/auth';
import '../styles/Dashboard.css';

const Sidebar = ({ activeSection, onSectionChange }) => {
  const userData = getUserData();
  const isOwner = userData?.role === 'Owner';

  return (
    <aside className="sidebar">
      <div className="logo-placeholder"></div>
      <nav className="nav-menu">
        <ul>
          {/* Chỉ Owner mới thấy Manage Employee */}
          {isOwner && (
            <li 
              className={`nav-item ${activeSection === 'employees' ? 'active' : ''}`}
              onClick={() => onSectionChange('employees')}
            >
              Manage Employee
            </li>
          )}
          <li 
            className={`nav-item ${activeSection === 'tasks' ? 'active' : ''}`}
            onClick={() => onSectionChange('tasks')}
          >
            Manage Task
          </li>
          <li 
            className={`nav-item ${activeSection === 'messages' ? 'active' : ''}`}
            onClick={() => onSectionChange('messages')}
          >
            Message
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;