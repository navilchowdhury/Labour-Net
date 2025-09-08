import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/professional.css';

export default function WorkerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reporting, setReporting] = useState(false);
  const [reportReasons, setReportReasons] = useState({});
  const [showReportForm, setShowReportForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'worker') {
      navigate('/jobs');
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
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // [ADDED] Worker reports employer
  const handleReportEmployer = async (jobId, reason) => {
    try {
      setReporting(true);
      
      if (!reason || reason.trim() === '') {
        alert('Please provide a reason for reporting the employer.');
        return;
      }
      
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/applications/report',
        { jobId, reason: reason.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Employer reported successfully!');
      setShowReportForm({ ...showReportForm, [jobId]: false });
      setReportReasons({ ...reportReasons, [jobId]: '' });
      fetchApplications(); // Refresh to show updated status
    } catch (err) {
      console.error('Report error:', err);
      if (err.response?.status === 403) {
        alert('You are not assigned to this job and cannot report the employer.');
      } else if (err.response?.status === 404) {
        alert('Job not found.');
      } else {
        alert(err.response?.data?.error || 'Failed to report employer. Please try again.');
      }
    } finally {
      setReporting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'assigned': return '#007bff';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '⏳ Pending Review';
      case 'accepted': return '✓ Application Accepted';
      case 'rejected': return '✗ Application Rejected';
      case 'assigned': return '🎯 Job Assigned to You!';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <h2>Loading your applications...</h2>
      </div>
    );
  }

  return (
    <div className="professional-container">
      <div className="professional-page-header">
        <h1 className="professional-page-title">My Job Applications</h1>
        <p className="professional-page-subtitle">Track the status of your job applications and manage your opportunities</p>
      </div>
      
      {applications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No Applications Yet</h3>
          <p className="empty-state-description">Start applying for jobs to see your applications here!</p>
          <button 
            onClick={() => navigate('/jobs')}
            className="professional-btn professional-btn-primary professional-btn-lg"
          >
            🔍 Browse Jobs
          </button>
        </div>
      ) : (
        <div>
          {applications.map((application) => (
            <div key={application._id} className="professional-card application-card">
              <div className="professional-card-header">
                <div className="application-header">
                  <div style={{ flex: 1 }}>
                    <h3 className="application-title">
                      {application.job.category} Position
                    </h3>
                    
                    <div className="job-details-grid" style={{ marginBottom: '1rem' }}>
                      <div className="job-detail-item">
                        <div className="job-detail-icon">👤</div>
                        <div className="job-detail-content">
                          <p className="job-detail-label">Employer</p>
                          <p className="job-detail-value">
                            {application.employer.name}
                            {application.employer.reportedCount > 0 && (
                              <span style={{ 
                                marginLeft: '8px', 
                                padding: '2px 6px', 
                                borderRadius: '4px', 
                                background: application.employer.reportedCount >= 3 ? '#ef4444' : '#f59e0b', 
                                color: 'white', 
                                fontSize: '0.75rem' 
                              }}>
                                {application.employer.reportedCount >= 3 ? '🚨' : '⚠️'} {application.employer.reportedCount} report{application.employer.reportedCount > 1 ? 's' : ''}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="job-detail-item">
                        <div className="job-detail-icon">📞</div>
                        <div className="job-detail-content">
                          <p className="job-detail-label">Contact</p>
                          <p className="job-detail-value">{application.employer.contact}</p>
                        </div>
                      </div>
                      
                      <div className="job-detail-item">
                        <div className="job-detail-icon">⏰</div>
                        <div className="job-detail-content">
                          <p className="job-detail-label">Working Hours</p>
                          <p className="job-detail-value">{application.job.workingHours}</p>
                        </div>
                      </div>
                      
                      <div className="job-detail-item">
                        <div className="job-detail-icon">💰</div>
                        <div className="job-detail-content">
                          <p className="job-detail-label">Salary</p>
                          <p className="job-detail-value">{application.job.salaryRange}</p>
                        </div>
                      </div>
                      
                      <div className="job-detail-item">
                        <div className="job-detail-icon">📍</div>
                        <div className="job-detail-content">
                          <p className="job-detail-label">Address</p>
                          <p className="job-detail-value">{application.job.address}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="job-description">
                      <p className="job-description-text">{application.job.description}</p>
                    </div>
                  </div>

                  <div className="application-status-container">
                    <div className={`status-badge status-${application.status}`}>
                      {getStatusText(application.status)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="professional-card-body">
                {application.message && (
                  <div className="application-message">
                    <p className="application-message-label">Your Message:</p>
                    <p className="application-message-text">"{application.message}"</p>
                  </div>
                )}

                <div className="job-details-grid">
                  <div className="job-detail-item">
                    <div className="job-detail-icon">📅</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Applied</p>
                      <p className="job-detail-value">{new Date(application.appliedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {application.assignedAt && (
                    <div className="job-detail-item">
                      <div className="job-detail-icon">✅</div>
                      <div className="job-detail-content">
                        <p className="job-detail-label">Assigned</p>
                        <p className="job-detail-value">{new Date(application.assignedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {application.status === 'assigned' && (
                  <div className="professional-alert professional-alert-success" style={{ marginTop: '1rem' }}>
                    <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      🎉 Congratulations! You've been assigned to this job!
                    </p>
                    
                    {/* Report employer button */}
                    {!showReportForm[application.job._id] ? (
                      <button 
                        onClick={() => setShowReportForm({ ...showReportForm, [application.job._id]: true })}
                        disabled={reporting}
                        className="professional-btn professional-btn-danger professional-btn-sm"
                      >
                        🚨 Report Employer
                      </button>
                    ) : (
                      <div className="professional-card" style={{ marginTop: '1rem' }}>
                        <div className="professional-card-body">
                          <div className="professional-form-group">
                            <label className="professional-form-label">Reason for reporting (required)</label>
                            <input
                              type="text"
                              placeholder="Please describe the issue..."
                              value={reportReasons[application.job._id] || ''}
                              onChange={(e) => setReportReasons({ ...reportReasons, [application.job._id]: e.target.value })}
                              className="professional-form-input"
                            />
                          </div>
                          <div className="job-actions">
                            <button
                              onClick={() => handleReportEmployer(application.job._id, reportReasons[application.job._id])}
                              disabled={reporting || !reportReasons[application.job._id]}
                              className="professional-btn professional-btn-danger professional-btn-sm"
                            >
                              {reporting ? 'Reporting...' : 'Submit Report'}
                            </button>
                            <button
                              onClick={() => {
                                setShowReportForm({ ...showReportForm, [application.job._id]: false });
                                setReportReasons({ ...reportReasons, [application.job._id]: '' });
                              }}
                              className="professional-btn professional-btn-secondary professional-btn-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 