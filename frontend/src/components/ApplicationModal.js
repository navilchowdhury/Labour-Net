import React, { useState } from 'react';

export default function ApplicationModal({ isOpen, onClose, onSubmit, jobTitle }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '20px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          margin: '-30px -30px 25px -30px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            🚀 Apply for {jobTitle}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px', 
              fontWeight: '600',
              color: '#2d3748',
              fontSize: '16px'
            }}>
              💬 Message to Employer (Optional):
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the employer why you're a great fit for this job... Share your experience, skills, and enthusiasm!"
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '15px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                resize: 'vertical',
                fontSize: '14px',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
            <p style={{ 
              margin: '8px 0 0 0', 
              fontSize: '12px', 
              color: '#718096',
              fontStyle: 'italic'
            }}>
              A personalized message can significantly increase your chances of getting hired!
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'flex-end',
            flexWrap: 'wrap'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: '#e2e8f0',
                color: '#4a5568',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#cbd5e1';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ❌ Cancel
            </button>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              🚀 Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 