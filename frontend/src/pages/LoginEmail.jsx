import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationCard from '../components/AuthenticationCard';
import { sendEmployeeOTP, validateEmployeeOTP, isLoggedIn, getUserRole } from '../API/auth';

const LoginEmail = () => {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(null); // 'success' | 'error'
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/manager');
    }
  }, [navigate]);

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  const handleSendCode = async () => {
    if (!isValidEmail(email.trim())) {
      setMessage('Invalid email format. Please enter a valid email address.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType(null);
    try {
      const data = await sendEmployeeOTP(email.trim());
      if (data.message) {
        setStep(2);
        setMessage('Access code sent successfully');
        setMessageType('success');
      } else {
        setMessage(data.error || 'Failed to send code');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error');
      setMessageType('error');
    }
    setLoading(false);
  };

  const handleValidateCode = async () => {
    setLoading(true);
    setMessage('');
    setMessageType(null);
    try {
      const data = await validateEmployeeOTP(email, accessCode);
      if (data.success) {
        // Only dashboard route exists
        navigate('/dashboard');
      } else {
        setMessage(data.error || 'Invalid code');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error');
      setMessageType('error');
    }
    setLoading(false);
  };

  if (step === 1) {
    return (
      <AuthenticationCard
        title="Sign In"
        subtitle="Please enter your email to sign in"
        inputType="email"
        inputPlaceholder="Your Email Address"
        inputValue={email}
        onInputChange={(e) => setEmail(e.target.value)}
        buttonText={loading ? 'Sending...' : 'Next'}
        onButtonClick={handleSendCode}
        message={message}
        messageType={messageType}
        bottomText="passwordless authentication methods."
        linkText="Don’t having account? Sign up"
        onLinkClick={() => navigate('/login-email')}
        buttonProps={{ disabled: loading || !isValidEmail(email.trim()) }}
        cardType="signin"
      />
    );
  }

  return (
    <AuthenticationCard
      title="Email verification"
      subtitle="Please enter your code that send to your email address"
      inputType="text"
      inputPlaceholder="Enter Your code"
      inputValue={accessCode}
      onInputChange={(e) => setAccessCode(e.target.value)}
      buttonText={loading ? 'Submitting...' : 'Submit'}
      onButtonClick={handleValidateCode}
      message={message}
      messageType={messageType}
      linkText="Code not receive? Send again"
      onLinkClick={handleSendCode}
      buttonProps={{ disabled: loading }}
      cardType="signup"
    />
  );
};

export default LoginEmail;