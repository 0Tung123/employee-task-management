import React from 'react';
import '../styles/Dashboard.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-placeholder"></div>
      <nav className="nav-menu">
        <ul>
          <li className="nav-item active">Manage Employee</li>
          <li className="nav-item">Manage Task</li>
          <li className="nav-item">Message</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;