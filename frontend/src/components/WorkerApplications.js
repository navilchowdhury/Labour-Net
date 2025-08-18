import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function WorkerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Modern color scheme
  const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#48bb78',
    warning: '#ed8936',
    danger: '#f56565',
    info: '#4299e1',
    light: '#f7fafc',
    dark: '#2d3748',
    gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    gradient5: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/applications/worker', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return colors.gradient5;
      case 'accepted':
        return colors.gradient3;
      case 'rejected':
        return colors.gradient2;
      case 'assigned':
        return colors.gradient4;
      default:
        return colors.gradient1;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✓';
      case 'rejected':
        return '✗';
      case 'assigned':
        return '🎯';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <h2 style={{ color: colors.dark }}>Loading your applications...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
          <h2 style={{ color: colors.dark }}>{error}</h2>
          <button 
            onClick={fetchApplications}
            style={{
              background: colors.gradient1,
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '15px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '20px'
            }}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: colors.gradient1, 
          padding: '40px', 
          borderRadius: '25px', 
          marginBottom: '30px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📋</div>
          <h1 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            My Applications
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: '1.2rem', 
            opacity: 0.9
          }}>
            Track the status of all your job applications
          </p>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div style={{ 
            background: 'white', 
            padding: '60px', 
            borderRadius: '20px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>📝</div>
            <h3 style={{ 
              margin: '0 0 15px 0', 
              color: colors.dark,
              fontSize: '1.5rem'
            }}>
              No Applications Yet
            </h3>
            <p style={{ 
              color: '#64748b', 
              margin: '0 0 25px 0',
              fontSize: '16px'
            }}>
              You haven't applied for any jobs yet. Start browsing available jobs to find opportunities that match your skills!
            </p>
            <button 
              onClick={() => navigate('/jobs')}
              style={{
                background: colors.gradient4,
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)'
              }}
            >
              🔍 Browse Jobs
            </button>
          </div>
        ) : (
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '20px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h2 style={{ 
                margin: 0, 
                color: colors.dark,
                fontSize: '1.8rem'
              }}>
                📊 Application Summary
              </h2>
              <div style={{ 
                background: colors.gradient4, 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '20px',
                fontWeight: 'bold'
              }}>
                {applications.length} Application{applications.length !== 1 ? 's' : ''}
              </div>
            </div>

            {applications.map((application, index) => (
              <div key={application._id} style={{ 
                background: '#f8fafc', 
                padding: '25px', 
                borderRadius: '15px',
                marginBottom: '20px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '20px'
                }}>
                  <div>
                    <h3 style={{ 
                      margin: '0 0 10px 0', 
                      color: colors.dark,
                      fontSize: '1.3rem'
                    }}>
                      🏢 {application.job?.title || 'Job Title'}
                    </h3>
                    <p style={{ 
                      margin: '5px 0', 
                      color: '#64748b',
                      fontSize: '16px'
                    }}>
                      <strong>Category:</strong> {application.job?.category || 'N/A'}
                    </p>
                    <p style={{ 
                      margin: '5px 0', 
                      color: '#64748b',
                      fontSize: '16px'
                    }}>
                      <strong>Salary:</strong> ${application.job?.salary || 'N/A'}
                    </p>
                    <p style={{ 
                      margin: '5px 0', 
                      color: '#64748b',
                      fontSize: '16px'
                    }}>
                      <strong>Location:</strong> {application.job?.location || 'N/A'}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      background: getStatusColor(application.status), 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      marginBottom: '10px',
                      display: 'inline-block'
                    }}>
                      {getStatusIcon(application.status)} {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                    <p style={{ 
                      margin: '5px 0', 
                      color: '#64748b',
                      fontSize: '14px'
                    }}>
                      Applied: {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                    {application.assignedAt && (
                      <p style={{ 
                        margin: '5px 0', 
                        color: '#64748b',
                        fontSize: '14px'
                      }}>
                        Assigned: {new Date(application.assignedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {application.message && (
                  <div style={{ 
                    background: 'white', 
                    padding: '15px', 
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    marginTop: '15px'
                  }}>
                    <p style={{ 
                      margin: '0 0 8px 0', 
                      color: colors.dark,
                      fontWeight: '600'
                    }}>
                      💬 Your Message:
                    </p>
                    <p style={{ 
                      margin: 0, 
                      color: '#64748b',
                      fontStyle: 'italic'
                    }}>
                      "{application.message}"
                    </p>
                  </div>
                )}

                {application.job?.employer && (
                  <div style={{ 
                    background: 'white', 
                    padding: '15px', 
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    marginTop: '15px'
                  }}>
                    <p style={{ 
                      margin: '0 0 8px 0', 
                      color: colors.dark,
                      fontWeight: '600'
                    }}>
                      👤 Employer Contact:
                    </p>
                    <p style={{ 
                      margin: '5px 0', 
                      color: '#64748b'
                    }}>
                      <strong>Name:</strong> {application.job.employer.name}
                    </p>
                    <p style={{ 
                      margin: '5px 0', 
                      color: '#64748b'
                    }}>
                      <strong>Contact:</strong> {application.job.employer.contact}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 