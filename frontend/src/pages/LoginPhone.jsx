import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationCard from '../components/AuthenticationCard';
import { sendOwnerOTP, validateOwnerOTP, getUserRole, isLoggedIn } from '../API/auth';

const LoginPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const isValidPhone = (v) => /^[1-9]\d{7,14}$/.test(v);
  const sanitizePhone = (v) => v.replace(/\D/g, '').slice(0, 15);
  const phoneValid = isValidPhone(phoneNumber);

  const handleSendCode = async () => {
    const trimmed = phoneNumber.trim();
    if (!isValidPhone(trimmed)) {
      setMessage("Invalid phone number. Use international format without '+', e.g., 849xxxxxxxx for Vietnam.");
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType(null);
    try {
      const data = await sendOwnerOTP(trimmed);
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
      const data = await validateOwnerOTP(phoneNumber, accessCode);
      if (data.success) {
        localStorage.setItem('phoneNumber', phoneNumber);
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
        title="Owner Sign In"
        subtitle="Enter your phone number for secure access"
        inputType="text"
        inputPlaceholder="Your Phone Number"
        inputValue={phoneNumber}
        onInputChange={(e) => setPhoneNumber(sanitizePhone(e.target.value))}
        buttonText={loading ? 'Sending...' : 'Next'}
        onButtonClick={handleSendCode}
        message={message}
        messageType={messageType}
        bottomText="Format: [country code][phone number], example: 849xxxxxxxx"
        footerText="Are you an employee?"
        linkText="Sign in"
        onLinkClick={() => navigate('/employee-login')}
        buttonProps={{ disabled: loading || !phoneValid }}
        cardType="signin"
      />
    );
  }

  return (
    <AuthenticationCard
      title="Phone verification"
      subtitle="Please enter your code that send to your phone"
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
      cardType="signin"
    />
  );
};

export default LoginPhone;