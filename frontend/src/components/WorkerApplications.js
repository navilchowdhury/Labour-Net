import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WorkerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('http://localhost:5000/api/applications/worker', { headers });
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
      setError('Failed to load applications. Please try again.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // [ADDED] Worker reports employer
  const handleReportEmployer = async (jobId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/applications/report',
        { jobId, reason: 'Unfair treatment' },
        { headers }
      );
      alert('Employer reported!');
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to report employer');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 800, margin: 'auto', padding: 20, textAlign: 'center' }}>
        <h2>My Applications</h2>
        <p>Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: 'auto', padding: 20, textAlign: 'center' }}>
        <h2>My Applications</h2>
        <p style={{ color: '#e53e3e' }}>{error}</p>
        <button 
          onClick={fetchApplications}
          style={{
            background: '#3182ce',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h2 style={{ color: '#2d3e50', marginBottom: '20px' }}>My Applications</h2>

      {applications.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          background: '#f8f9fa', 
          borderRadius: '8px',
          border: '2px dashed #dee2e6'
        }}>
          <p style={{ color: '#6c757d', fontSize: '18px' }}>No applications found.</p>
          <p style={{ color: '#6c757d' }}>Apply for jobs to see them here!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {applications.map((app) => (
            <div 
              key={app._id} 
              style={{ 
                border: '1px solid #e9ecef', 
                borderRadius: '12px', 
                padding: '20px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#2d3e50', fontSize: '20px' }}>
                  {app.job?.category || 'Unknown'} Position
                </h3>
                <span 
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    background: app.status === 'assigned' ? '#e3f2fd' : 
                               app.status === 'completed' ? '#e8f5e8' :
                               app.status === 'rejected' ? '#ffebee' : '#f3e5f5',
                    color: app.status === 'assigned' ? '#1976d2' : 
                           app.status === 'completed' ? '#2e7d32' :
                           app.status === 'rejected' ? '#c62828' : '#7b1fa2'
                  }}
                >
                  {app.status}
                </span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ margin: '5px 0', color: '#495057' }}>
                  <strong>Employer:</strong> {app.job?.employer?.name || 'Unknown'}
                </p>
                <p style={{ margin: '5px 0', color: '#495057' }}>
                  <strong>Contact:</strong> {app.job?.employer?.contact || 'Not provided'}
                </p>
                <p style={{ margin: '5px 0', color: '#495057' }}>
                  <strong>Salary:</strong> {app.job?.salary || app.job?.salaryRange || 'Not specified'}
                </p>
                <p style={{ margin: '5px 0', color: '#495057' }}>
                  <strong>Location:</strong> {app.job?.location || app.job?.address || 'Not specified'}
                </p>
                <p style={{ margin: '5px 0', color: '#495057' }}>
                  <strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              {app.job?.description && (
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  marginBottom: '15px',
                  borderLeft: '4px solid #007bff'
                }}>
                  <p style={{ margin: 0, color: '#495057', fontStyle: 'italic' }}>
                    "{app.job.description}"
                  </p>
                </div>
              )}

              {/* Report Employer button if assigned */}
              {app.status === 'assigned' && (
                <button 
                  onClick={() => handleReportEmployer(app.job._id)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '15px'
                  }}
                >
                  Report Employer
                </button>
              )}

              {/* Show review from employer if exists */}
              {app.review && (
                <div style={{ 
                  marginTop: '15px',
                  padding: '15px',
                  background: '#fff3cd',
                  borderRadius: '8px',
                  border: '1px solid #ffeaa7'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#856404' }}>
                    Review from Employer:
                  </p>
                  <div style={{ marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star} 
                        style={{ 
                          color: app.review.rating >= star ? '#ffc107' : '#dee2e6', 
                          fontSize: '18px',
                          marginRight: '2px'
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <span style={{ marginLeft: '8px', color: '#856404', fontWeight: '600' }}>
                      {app.review.rating}/5
                    </span>
                  </div>
                  {app.review.comment && (
                    <p style={{ margin: 0, color: '#856404', fontStyle: 'italic' }}>
                      "{app.review.comment}"
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
