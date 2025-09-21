import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthenticationCard from '../components/AuthenticationCard';
import { verifySetupToken, setupAccount } from '../API/setup';

const SetupAccount = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
      const response = await setupAccount(token, password, name || undefined, phone || undefined);
      if (response.success) {
        setMessage('Account setup successful! Redirecting to login...');
        setMessageType('success');
        setTimeout(() => {
          navigate('/login-email');
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
    <AuthenticationCard title="Setup Your Account">
      {step === 1 ? (
        <div>
          <p>Verifying your setup link...</p>
          {loading && <p>Loading...</p>}
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Welcome {employeeData?.name || employeeData?.email}!</p>
          <p>Please complete your account setup.</p>

          <div className="input-group">
            <label htmlFor="name">Name (optional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone (optional)</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
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
            disabled={loading || !password || !confirmPassword}
          >
            {loading ? 'Setting up...' : 'Setup Account'}
          </button>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      )}
    </AuthenticationCard>
  );
};

export default SetupAccount;