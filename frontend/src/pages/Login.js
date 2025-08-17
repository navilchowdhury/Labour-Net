import React, { useState } from 'react';
import AuthForm from '../components/Authform';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (form) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        name: form.name,
        password: form.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      navigate('/jobs');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Invalid credentials';
      setError(errorMessage);
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: 30 }}>Login</h2>
      <AuthForm type="login" onSubmit={handleLogin} />
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
}