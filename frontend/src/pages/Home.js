import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2d3e50 0%, #00b4d8 100%)',
      color: '#fff',
      padding: 0,
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 'bold',
        marginBottom: 16,
        letterSpacing: 2,
        textShadow: '2px 2px 8px #2228',
        animation: 'fadeInDown 1s',
      }}>
        Welcome to <span style={{ color: '#ffd166' }}>LABOR NET</span>
      </h1>
      <p style={{
        fontSize: 22,
        color: '#e0e0e0',
        marginBottom: 32,
        maxWidth: 500,
        lineHeight: 1.5,
        animation: 'fadeIn 2s',
      }}>
        Empowering blue-collar workers and connecting them with employers.<br />
        <span style={{ color: '#ffd166', fontWeight: 500 }}>Find jobs. Hire talent. Build your future.</span>
      </p>
      <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
        <Link to="/register" style={{
          background: '#ffd166',
          color: '#2d3e50',
          padding: '14px 36px',
          borderRadius: 30,
          fontWeight: 'bold',
          fontSize: 18,
          textDecoration: 'none',
          boxShadow: '0 4px 16px #0002',
          transition: 'background 0.2s',
        }}>Sign Up</Link>
        <Link to="/login" style={{
          background: 'transparent',
          color: '#fff',
          border: '2px solid #ffd166',
          padding: '14px 36px',
          borderRadius: 30,
          fontWeight: 'bold',
          fontSize: 18,
          textDecoration: 'none',
          boxShadow: '0 4px 16px #0002',
          transition: 'background 0.2s, color 0.2s',
        }}>Login</Link>
      </div>
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
