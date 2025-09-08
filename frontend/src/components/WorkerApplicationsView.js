import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/WorkerApplicationsView.css';

const WorkerApplicationsView = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkerApplications();
  }, []);

  const fetchWorkerApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/applications/worker', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching worker applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'assigned': return '#27ae60';
      case 'completed': return '#3498db';
      case 'rejected': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (loading) {
    return (
      <div className="worker-applications-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="worker-applications-container">
      <div className="worker-applications-header">
        <h1>My Job Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      <div className="applications-grid">
        {applications.length === 0 ? (
          <div className="no-applications">
            <div className="no-applications-icon">📋</div>
            <h3>No Applications Yet</h3>
            <p>You haven't applied for any jobs yet. Browse available jobs to get started!</p>
          </div>
        ) : (
          applications.map((application) => (
            <div key={application._id} className="application-card">
              <div className="application-header">
                <h3>{application.job?.title || `${application.job?.category} Position`}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(application.status) }}
                >
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>

              <div className="application-details">
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{application.job?.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Employer:</span>
                  <span className="detail-value">{application.job?.employer?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{application.job?.location || application.job?.address}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Salary:</span>
                  <span className="detail-value">{application.job?.salary || application.job?.salaryRange}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Applied:</span>
                  <span className="detail-value">{formatDate(application.createdAt)}</span>
                </div>
              </div>

              {application.job?.description && (
                <div className="job-description">
                  <h4>Job Description:</h4>
                  <p>{application.job.description}</p>
                </div>
              )}

              {application.status === 'assigned' && (
                <div className="status-message success">
                  🎉 Congratulations! You've been assigned to this job.
                </div>
              )}

              {application.status === 'completed' && (
                <div className="status-message completed">
                  ✅ Job completed successfully!
                </div>
              )}

              {application.status === 'rejected' && (
                <div className="status-message rejected">
                  ❌ Application was not selected for this position.
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkerApplicationsView;
