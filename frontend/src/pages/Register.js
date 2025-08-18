import React, { useState } from 'react';
import AuthForm from '../components/Authform';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (form) => {
    try {
      const payload = {
        ...form,
        // jobPreferences is already an array from the form
        jobTypes: form.jobTypes ? form.jobTypes.split(',').map(s => s.trim()) : [],
      };
      await axios.post('http://localhost:5000/api/auth/register', payload);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
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
          Join Labour NET
        </h2>
        <AuthForm type="register" onSubmit={handleRegister} />
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