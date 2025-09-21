import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SetupAccountCard from '../components/SetupAccountCard';
import { verifySetupToken, setupAccount } from '../API/setup';

const SetupAccount = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(null);
  const [step, setStep] = useState(1);
  const [employeeData, setEmployeeData] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage('Invalid setup link. No token provided.');
      setMessageType('error');
      return;
    }

    const verifyToken = async () => {
      setLoading(true);
      try {
        const response = await verifySetupToken(token);
        if (response.success) {
          setEmployeeData(response.employee);
          setStep(2);
        } else {
          setMessage(response.error || 'Invalid token');
          setMessageType('error');
        }
      } catch (error) {
        setMessage('Failed to verify token');
        setMessageType('error');
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const handleSetup = async () => {
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType(null);
    try {
      const response = await setupAccount(token, password, username || undefined);
      if (response.success) {
        setMessage('Account setup successful! Redirecting to login...');
        setMessageType('success');
        setTimeout(() => {
          navigate('/employee-login');
        }, 2000);
      } else {
        setMessage(response.error || 'Failed to setup account');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error');
      setMessageType('error');
    }
    setLoading(false);
  };

  return (
    <SetupAccountCard 
      title="Setup Your Account"
      message={message}
      messageType={messageType}
    >
      {step === 1 ? (
        <div>
          <div className="loading-text">Verifying your setup link...</div>
          {loading && <div className="loading-text">Loading...</div>}
        </div>
      ) : (
        <div>
          <div className="welcome-text">
            Welcome <strong>{employeeData?.name || employeeData?.email}</strong>!<br />
            Please complete your account setup.
          </div>

          <div className="input-group">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
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
              placeholder="Enter a password (min 6 characters)"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            className="auth-button"
            onClick={handleSetup}
            disabled={loading || !password || !confirmPassword || !username}
          >
            {loading ? 'Setting up...' : 'Setup Account'}
          </button>
        </div>
      )}
    </SetupAccountCard>
  );
};

export default SetupAccount;