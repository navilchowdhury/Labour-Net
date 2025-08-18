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
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/jobs');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Invalid credentials';
      setError(errorMessage);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, #2c5aa0 0%, #1a202c 100%)`,
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        paddingTop: '40px' 
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '30px',
          color: 'white',
          fontSize: '2.5rem',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          Welcome Back to Labour NET
        </h2>
        <AuthForm type="login" onSubmit={handleLogin} />
        {error && (
          <div style={{ 
            background: 'rgba(229, 62, 62, 0.9)', 
            color: 'white', 
            padding: '15px', 
            borderRadius: '8px', 
            marginTop: '20px',
            textAlign: 'center',
            border: '1px solid #e53e3e'
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}