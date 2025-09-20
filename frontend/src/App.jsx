import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPhone from './pages/LoginPhone';
import LoginEmail from './pages/LoginEmail';
import ManagerDashboard from './pages/ManagerDashboard';
import SetupAccount from './pages/SetupAccount';

import './styles/App.css';

function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login-email" replace />} />
          {/* Auth routes */}
          <Route path="/login-phone" element={<LoginPhone />} />
          <Route path="/login-email" element={<LoginEmail />} />
          {/* Setup account route */}
          <Route path="/setup-account" element={<SetupAccount />} />
          {/* Redirect deprecated signup routes to their login counterparts */}
          <Route path="/signup-phone" element={<Navigate to="/login-phone" replace />} />
          <Route path="/signup-email" element={<Navigate to="/login-email" replace />} />
          {/* App routes */}
          <Route path="/manager" element={<ManagerDashboard />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login-email" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;