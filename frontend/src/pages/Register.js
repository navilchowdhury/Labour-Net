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
        jobPreferences: form.jobPreferences ? form.jobPreferences.split(',').map(s => s.trim()) : [],
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
    <div>
      <h2 style={{ textAlign: 'center', marginTop: 30 }}>Register</h2>
      <AuthForm type="register" onSubmit={handleRegister} />
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
}