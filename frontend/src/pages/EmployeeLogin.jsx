import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SetupAccountCard from '../components/SetupAccountCard';
import { loginEmployee, isLoggedIn } from '../API/auth';

const EmployeeLogin = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!usernameOrEmail.trim()) {
      setMessage('Username or email is required.');
      setMessageType('error');
      return;
    }

    if (!password.trim()) {
      setMessage('Password is required.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType(null);
    
    try {
      const data = await loginEmployee(usernameOrEmail.trim(), password.trim());
      if (data.success) {
        setMessage('Login successful! Redirecting...');
        setMessageType('success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessage(data.error || 'Login failed');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setMessageType('error');
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <SetupAccountCard 
      title="Employee Login"
      message={message}
      messageType={messageType}
    >
      <div>
        <div className="welcome-text">
          Welcome back!<br />
          Please sign in to your account.
        </div>

        <div className="input-group">
          <label htmlFor="usernameOrEmail">Username or Email *</label>
          <input
            id="usernameOrEmail"
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your username or email"
            disabled={loading}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your password"
            disabled={loading}
            required
          />
        </div>

        <button
          className="auth-button"
          onClick={handleLogin}
          disabled={loading || !usernameOrEmail.trim() || !password.trim()}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="auth-links">
          <p>
            Don't have an account? Contact your administrator.
          </p>
          <p>
            <span 
              className="link-text" 
              onClick={() => navigate('/login-email')}
            >
              Use OTP Login instead
            </span>
          </p>
        </div>
      </div>
    </SetupAccountCard>
  );
};

export default EmployeeLogin;