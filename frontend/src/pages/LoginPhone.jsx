import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationCard from '../components/AuthenticationCard';
import { sendOwnerOTP, validateOwnerOTP, getUserRole } from '../API/auth';

const LoginPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(null);
  const navigate = useNavigate();

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
        title="Sign In"
        subtitle="Please enter your phone to sign in"
        inputType="text"
        inputPlaceholder="Your Phone Number"
        inputValue={phoneNumber}
        onInputChange={(e) => setPhoneNumber(sanitizePhone(e.target.value))}
        buttonText={loading ? 'Sending...' : 'Next'}
        onButtonClick={handleSendCode}
        message={message}
        messageType={messageType}
        bottomText="passwordless authentication methods."
        linkText="Don’t having account? Sign up"
        onLinkClick={() => navigate('/signup-phone')}
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