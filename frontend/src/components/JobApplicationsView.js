import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/JobApplicationsView.css';

const JobApplicationsView = ({ jobId, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const assignWorker = async (workerId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Frontend assignment request:', { jobId, workerId });
      const response = await axios.post('http://localhost:5000/api/applications/assign', {
        jobId,
        workerId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Assignment response:', response.data);
      alert('Worker assigned successfully!');
      fetchApplications();
      if (onClose) onClose(); // Close the modal after successful assignment
    } catch (error) {
      console.error('Error assigning worker:', error);
      console.error('Error details:', error.response?.data);
      const errorMessage = error.response?.data?.error || 'Failed to assign worker';
      alert(`Assignment failed: ${errorMessage}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="applications-modal">
        <div className="applications-content">
          <div className="loading">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-modal" onClick={(e) => {
      if (e.target === e.currentTarget && typeof onClose === 'function') {
        onClose();
      }
    }}>
      <div className="applications-content">
        <div className="applications-header">
          <h2>Job Applications</h2>
          <button 
            type="button"
            onClick={() => {
              if (typeof onClose === 'function') {
                onClose();
              }
            }} 
            className="close-btn"
            style={{ 
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '28px',
              cursor: 'pointer',
              padding: '5px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              zIndex: 9999
            }}
          >
            ×
          </button>
        </div>

        <div className="applications-list">
          {applications.length === 0 ? (
            <div className="no-applications">
              <p>No applications received yet.</p>
            </div>
          ) : (
            applications.map((application) => (
              <div key={application._id} className="application-card">
                <div className="application-header">
                  <div className="worker-basic-info">
                    <h3>{application.worker.name}</h3>
                    <span className={`application-status ${application.status}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="application-actions">
                    <button 
                      onClick={() => setSelectedWorker(application.worker)}
                      className="view-profile-btn"
                    >
                      View Full Profile
                    </button>
                    {application.status === 'pending' && (
                      <button 
                        onClick={() => assignWorker(application.worker._id)}
                        className="assign-btn"
                      >
                        Assign Worker
                      </button>
                    )}
                  </div>
                </div>

                <div className="worker-summary">
                  <div className="worker-details">
                    <p><strong>Contact:</strong> {application.worker.contact}</p>
                    <p><strong>Address:</strong> {application.worker.address}</p>
                    <p><strong>Availability:</strong> {application.worker.availability}</p>
                    {application.worker.isNidVerified && (
                      <div className="verification-badge">✅ NID Verified</div>
                    )}
                  </div>

                  <div className="worker-skills">
                    <strong>Skills:</strong>
                    <div className="skills-tags">
                      {application.worker.jobPreferences?.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      )) || <span>No skills listed</span>}
                    </div>
                  </div>

                  {application.worker.jobHistory?.length > 0 && (
                    <div className="job-history">
                      <h4 style={{ 
                        margin: '0 0 12px 0', 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        color: '#2d3748',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        💼 Work Experience ({application.worker.jobHistory?.length || 0} jobs)
                      </h4>
                      {application.worker.jobHistory && application.worker.jobHistory.length > 0 ? (
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {application.worker.jobHistory.slice(0, 5).map((job, index) => (
                            <div key={index} style={{
                              background: '#f8f9fa',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  background: '#3182ce',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  textTransform: 'uppercase'
                                }}>
                                  {job.jobCategory}
                                </div>
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '6px',
                                  fontSize: '13px',
                                  color: '#4a5568'
                                }}>
                                  <span>📍</span>
                                  <span>{job.location}</span>
                                </div>
                              </div>
                              <div style={{
                                background: job.status === 'completed' ? '#38a169' : '#3182ce',
                                color: 'white',
                                padding: '3px 8px',
                                borderRadius: '10px',
                                fontSize: '10px',
                                fontWeight: '600'
                              }}>
                                {job.status === 'completed' ? '✓ Completed' : 'In Progress'}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ 
                          margin: '0', 
                          fontSize: '13px', 
                          color: '#718096',
                          fontStyle: 'italic'
                        }}>
                          No work history available
                        </p>
                      )}
                      {application.worker.reviews && application.worker.reviews.total > 0 && (
                        <div style={{
                          marginTop: '12px',
                          padding: '8px 12px',
                          background: '#e6fffa',
                          borderRadius: '6px',
                          border: '1px solid #81e6d9'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#234e52'
                          }}>
                            ⭐ {application.worker.reviews.averageRating}/5 
                            ({application.worker.reviews.total} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {application.worker.jobHistory?.length > 3 && (
                    <div className="more-history">
                      +{application.worker.jobHistory.length - 3} more jobs
                    </div>
                  )}

                  {application.message && (
                    <div className="application-message">
                      <strong>Message from Worker:</strong>
                      <p>{application.message}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Worker Profile Modal */}
        {selectedWorker && (
          <div className="worker-profile-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{selectedWorker.name}'s Complete Profile</h3>
                <button onClick={() => setSelectedWorker(null)} className="close-btn">×</button>
              </div>
              
              <div className="modal-body">
                <div className="profile-section">
                  <h4>Contact Information</h4>
                  <p><strong>Contact:</strong> {selectedWorker.contact || 'Not provided'}</p>
                  <p><strong>Address:</strong> {selectedWorker.address || 'Not provided'}</p>
                </div>

                <div className="profile-section">
                  <h4>Work Details</h4>
                  <p><strong>Availability:</strong> {selectedWorker.availability || 'Not specified'}</p>
                  <p><strong>Job Preferences:</strong></p>
                  <div className="skills-tags">
                    {selectedWorker.jobPreferences?.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    )) || <span>No preferences listed</span>}
                  </div>
                </div>

                {selectedWorker.jobHistory?.length > 0 && (
                  <div className="profile-section">
                    <h4>Complete Job History</h4>
                    <div className="job-history-list">
                      {selectedWorker.jobHistory.map((job, index) => (
                        <div key={index} className="job-history-item">
                          <div className="job-header">
                            <h5>{job.jobTitle}</h5>
                            <span className={`job-status ${job.status}`}>{job.status}</span>
                          </div>
                          <div className="job-details">
                            <p><strong>Category:</strong> {job.jobCategory}</p>
                            <p><strong>Employer:</strong> {job.employerName} {job.isCompany && '(Company)'}</p>
                            <p><strong>Salary:</strong> ৳{job.salary}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Date:</strong> {formatDate(job.assignedDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="profile-section">
                  <h4>Verification Status</h4>
                  <p className={selectedWorker.isNidVerified ? 'verified' : 'not-verified'}>
                    {selectedWorker.isNidVerified ? '✅ NID Verified' : '❌ NID Not Verified'}
                  </p>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => assignWorker(selectedWorker._id)}
                  className="assign-btn"
                >
                  Assign This Worker
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsView;
