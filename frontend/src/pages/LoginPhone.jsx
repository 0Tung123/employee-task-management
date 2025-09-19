import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationCard from '../components/AuthenticationCard';
import { sendAccessCode, validateAccessCode } from '../API/auth/OwnerApi';

const LoginPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await sendAccessCode(phoneNumber);
      if (data.message) {
        setStep(2);
        setMessage('Access code sent successfully');
      } else {
        setMessage(data.error || 'Failed to send code');
      }
    } catch (error) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  const handleValidateCode = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await validateAccessCode(phoneNumber, accessCode);
      if (data.success) {
        localStorage.setItem('phoneNumber', phoneNumber);
        navigate('/dashboard');
      } else {
        setMessage(data.error || 'Invalid code');
      }
    } catch (error) {
      setMessage('Network error');
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
        onInputChange={(e) => setPhoneNumber(e.target.value)}
        buttonText={loading ? 'Sending...' : 'Next'}
        onButtonClick={handleSendCode}
        message={message}
        bottomText="passwordless authentication methods."
        linkText="Don’t having account? Sign up"
        onLinkClick={() => navigate('/signup-phone')}
        buttonProps={{ disabled: loading }}
        cardType="signin"
      />
    );
  }

  return (
    <AuthenticationCard
      title="Enter Access Code"
      subtitle="Enter the code sent to your phone"
      inputType="text"
      inputPlaceholder="Access Code"
      inputValue={accessCode}
      onInputChange={(e) => setAccessCode(e.target.value)}
      buttonText={loading ? 'Validating...' : 'Validate Code'}
      onButtonClick={handleValidateCode}
      message={message}
      buttonProps={{ disabled: loading }}
      cardType="signin"
    />
  );
};

export default LoginPhone;