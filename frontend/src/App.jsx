import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPhone from './pages/LoginPhone';
import LoginEmail from './pages/LoginEmail';
import SetupAccount from './pages/SetupAccount';
import Dashboard from './pages/Dashboard';

import './styles/App.css';

function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login-phone" replace />} />
          <Route path="/login-phone" element={<LoginPhone />} />
          <Route path="/login-email" element={<LoginEmail />} />
          <Route path="/setup-account" element={<SetupAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup-phone" element={<Navigate to="/login-phone" replace />} />
          <Route path="/signup-email" element={<Navigate to="/login-email" replace />} />
          <Route path="*" element={<Navigate to="/login-phone" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;