import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationCard from '../components/AuthenticationCard';
import { signupWithEmail } from '../API/auth/OwnerApi';

const SignupEmail = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setMessage('');
    try {
      const data = await signupWithEmail(email, password);
      if (data.success) {
        navigate('/dashboard');
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  return (
    <AuthenticationCard
      title="Email verification"
      subtitle="Please enter your code that send to your email address"
      inputType="email"
      inputPlaceholder="Enter Your code"
      inputValue={email}
      onInputChange={(e) => setEmail(e.target.value)}
      buttonText={loading ? 'Sending...' : 'Submit'}
      onButtonClick={handleSignup}
      message={message}
      linkText="Code not receive? Send again"
      onLinkClick={() => navigate('/login-email')}
      buttonProps={{ disabled: loading }}
      cardType="signup"
    />
  );
};

export default SignupEmail;