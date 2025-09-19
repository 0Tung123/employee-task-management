import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPhone from './pages/LoginPhone';
import SignupPhone from './pages/SignupPhone';
import LoginEmail from './pages/LoginEmail';
import SignupEmail from './pages/SignupEmail';
import Dashboard from './pages/Dashboard';
import './styles/App.css';

function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login-phone" />} />
          <Route path="/login-phone" element={<LoginPhone />} />
          <Route path="/signup-phone" element={<SignupPhone />} />
          <Route path="/login-email" element={<LoginEmail />} />
          <Route path="/signup-email" element={<SignupEmail />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;