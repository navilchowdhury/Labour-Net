import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#2d3e50',
      color: '#fff',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: '#fff', fontWeight: 'bold', fontSize: 24, textDecoration: 'none' }}>LABOR NET</Link>
      </div>
      <div>
        {token ? (
          <>
            <Link to="/jobs" style={{ color: '#fff', marginRight: 20, textDecoration: 'none' }}>Jobs</Link>
            <Link to="/profile" style={{ color: '#fff', marginRight: 20, textDecoration: 'none' }}>Profile</Link>
            <button 
              onClick={handleLogout}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#fff', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: 20, textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}