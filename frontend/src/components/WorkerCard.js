import React from 'react';

export default function WorkerCard({ worker, onSelect }) {
  const getWorkerInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'W';
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString();
  };

  const getAge = (dob) => {
    if (!dob) return 'Not specified';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getVerificationBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem 0.75rem',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          fontSize: '0.75rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          ✅ Verified
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.25rem 0.75rem',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: 'white',
        borderRadius: 'var(--radius-xl)',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        ⏳ Pending
      </span>
    );
  };

  const getJobPreferences = (preferences) => {
    if (!preferences || preferences.length === 0) {
      return <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not specified</span>;
    }
    return preferences.slice(0, 3).map((pref, index) => (
      <span
        key={index}
        style={{
          display: 'inline-block',
          padding: '0.25rem 0.5rem',
          background: 'var(--primary-color)',
          color: 'white',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          fontWeight: '500',
          margin: '0.125rem',
          textTransform: 'capitalize'
        }}
      >
        {pref}
      </span>
    ));
  };

  return (
    <div 
      className="professional-card worker-card"
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={onSelect}
    >
      {/* Card Header with Avatar and Basic Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem',
        borderBottom: '1px solid var(--border-light)',
        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
      }}>
        {/* Avatar */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          flexShrink: 0,
          boxShadow: 'var(--shadow-md)'
        }}>
          {getWorkerInitials(worker.name)}
        </div>

        {/* Basic Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.5rem'
          }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {worker.name || 'Unknown Worker'}
            </h3>
            {getVerificationBadge(worker.isNidVerified)}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>
            <span>👤 {worker.sex ? worker.sex.charAt(0).toUpperCase() + worker.sex.slice(1) : 'Not specified'}</span>
            <span>•</span>
            <span>🎂 {getAge(worker.dob)} years old</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.5rem' }}>
        {/* Contact Information */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <span style={{ color: 'var(--primary-color)', fontSize: '1rem' }}>📞</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Contact:
            </span>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              {worker.contact || 'Not provided'}
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ color: 'var(--primary-color)', fontSize: '1rem' }}>📍</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Location:
            </span>
            <span style={{ 
              color: 'var(--text-primary)', 
              fontSize: '0.875rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '200px'
            }}>
              {worker.address || worker.location || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Job Preferences */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <span style={{ color: 'var(--primary-color)', fontSize: '1rem' }}>🛠️</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Skills:
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {getJobPreferences(worker.jobPreferences)}
            {worker.jobPreferences && worker.jobPreferences.length > 3 && (
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                background: 'var(--background-color)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: '500',
                border: '1px solid var(--border-color)'
              }}>
                +{worker.jobPreferences.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Availability */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <span style={{ color: 'var(--primary-color)', fontSize: '1rem' }}>⏰</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              Availability:
            </span>
          </div>
          <span style={{
            display: 'inline-block',
            padding: '0.375rem 0.75rem',
            background: 'var(--success-color)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {worker.availability || 'Not specified'}
          </span>
        </div>

      </div>

      {/* Card Footer */}
      <div style={{
        padding: '1rem 1.5rem',
        background: 'var(--background-color)',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          Member since {formatDate(worker.createdAt)}
        </div>
        
        <button
          style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, var(--primary-dark), var(--primary-color))';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, var(--primary-color), var(--primary-light))';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          View Profile →
        </button>
      </div>

      {/* Hover Effect Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(59, 130, 246, 0.05))',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none'
      }}
      className="worker-card-hover-overlay"
      />
    </div>
  );
}
