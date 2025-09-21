import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPhone from './pages/LoginPhone';
import LoginEmail from './pages/LoginEmail';
import EmployeeLogin from './pages/EmployeeLogin';
import SetupAccount from './pages/SetupAccount';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

import './styles/App.css';

function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login-phone" replace />} />
          <Route path="/login-phone" element={<LoginPhone />} />
          <Route path="/login-email" element={<LoginEmail />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/setup-account" element={<SetupAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup-phone" element={<Navigate to="/login-phone" replace />} />
          <Route path="/signup-email" element={<Navigate to="/login-email" replace />} />
          <Route path="*" element={<Navigate to="/login-phone" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;