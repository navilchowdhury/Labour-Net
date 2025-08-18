import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1a202c',
      color: '#fff',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderBottom: '1px solid #2d3748'
    }}>
      <div>
        <Link to="/" style={{ 
          color: '#fff', 
          fontWeight: '700', 
          fontSize: '24px', 
          textDecoration: 'none',
          letterSpacing: '0.5px'
        }}>
          Labour NET
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {token ? (
          <>
            <Link to="/jobs" style={{ 
              color: '#e2e8f0', 
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#fff';
              e.target.style.background = '#2d3748';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#e2e8f0';
              e.target.style.background = 'transparent';
            }}>
              Jobs
            </Link>
            {user?.role === 'worker' && (
              <Link to="/applications" style={{ 
                color: '#e2e8f0', 
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#fff';
                e.target.style.background = '#2d3748';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#e2e8f0';
                e.target.style.background = 'transparent';
              }}>
                My Applications
              </Link>
            )}
            <Link to="/profile" style={{ 
              color: '#e2e8f0', 
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#fff';
              e.target.style.background = '#2d3748';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#e2e8f0';
              e.target.style.background = 'transparent';
            }}>
              Profile
            </Link>
            <button 
              onClick={handleLogout}
              style={{ 
                background: '#e53e3e', 
                border: 'none', 
                color: '#fff', 
                cursor: 'pointer',
                fontSize: '14px',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#c53030';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#e53e3e';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ 
              color: '#e2e8f0', 
              textDecoration: 'none',
              padding: '8px 20px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#fff';
              e.target.style.background = '#2d3748';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#e2e8f0';
              e.target.style.background = 'transparent';
            }}>
              Login
            </Link>
            <Link to="/register" style={{ 
              color: '#fff', 
              textDecoration: 'none',
              padding: '10px 22px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              fontWeight: '600',
              background: '#3182ce',
              border: '1px solid #3182ce'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#2c5aa0';
              e.target.style.borderColor = '#2c5aa0';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#3182ce';
              e.target.style.borderColor = '#3182ce';
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}