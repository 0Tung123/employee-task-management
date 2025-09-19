import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationCard from '../components/AuthenticationCard';
import { loginWithEmail } from '../API/auth/OwnerApi';

const LoginEmail = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await loginWithEmail(email, password);
      if (data.success) {
        navigate('/dashboard');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  return (
    <AuthenticationCard
      title="Sign In"
      subtitle="Please enter your email to sign in"
      inputType="email"
      inputPlaceholder="Your Email Address"
      inputValue={email}
      onInputChange={(e) => setEmail(e.target.value)}
      buttonText={loading ? 'Sending...' : 'Next'}
      onButtonClick={handleLogin}
      message={message}
      bottomText="passwordless authentication methods."
      linkText="Don’t having account? Sign up"
      onLinkClick={() => navigate('/signup-email')}
      buttonProps={{ disabled: loading }}
      cardType="signin"
    />
  );
};

export default LoginEmail;