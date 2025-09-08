import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobApplicationsView from './JobApplicationsView';
import ReviewModal from './ReviewModal';

const EmployerJobsView = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [reviewModal, setReviewModal] = useState({ isOpen: false, worker: null, job: null });

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const fetchEmployerJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/jobs/employer', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
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

  const handleReviewWorker = (worker, job) => {
    setReviewModal({ isOpen: true, worker, job });
  };

  const handleReviewSubmitted = (review) => {
    // Refresh jobs to update status
    fetchEmployerJobs();
    setReviewModal({ isOpen: false, worker: null, job: null });
  };

  const markJobCompleted = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/jobs/${jobId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployerJobs();
    } catch (error) {
      console.error('Error marking job as completed:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading your jobs...</div>;
  }

  return (
    <div className="employer-jobs-view">
      <div className="jobs-header">
        <h2>My Posted Jobs</h2>
        <p>Manage your job postings and view applications</p>
      </div>

      <div className="jobs-grid">
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <p>You haven't posted any jobs yet.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3>{job.category} Position</h3>
                <span className={`job-status ${job.status}`}>{job.status}</span>
              </div>
              
              <div className="job-details">
                <p><strong>Working Hours:</strong> {job.workingHours}</p>
                <p><strong>Salary:</strong> {job.salaryRange}</p>
                <p><strong>Location:</strong> {job.address}</p>
                <p><strong>Posted:</strong> {formatDate(job.createdAt)}</p>
                {job.assignedWorker && (
                  <p><strong>Assigned Worker:</strong> {job.assignedWorker.name}</p>
                )}
              </div>

              {job.description && (
                <div className="job-description">
                  <p>{job.description}</p>
                </div>
              )}

              <div className="job-stats">
                <span className="applications-count">
                  {job.applications?.length || 0} Applications
                </span>
              </div>

              <div className="job-actions">
                <button 
                  onClick={() => setSelectedJobId(job._id)}
                  className="view-applications-btn"
                >
                  View Applications
                </button>
                {job.status === 'assigned' && job.assignedWorker && (
                  <button 
                    onClick={() => markJobCompleted(job._id)}
                    className="complete-job-btn"
                  >
                    Mark Complete
                  </button>
                )}
                {job.status === 'completed' && job.assignedWorker && (
                  <button 
                    onClick={() => {
                      console.log('Review button clicked:', { worker: job.assignedWorker, job: job });
                      handleReviewWorker(job.assignedWorker, job);
                    }}
                    className="review-worker-btn"
                  >
                    Review Worker
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedJobId && (
        <JobApplicationsView 
          jobId={selectedJobId}
          onClose={() => {
            console.log('EmployerJobsView: Closing modal, setting selectedJobId to null');
            setSelectedJobId(null);
          }}
        />
      )}

      <ReviewModal
        isOpen={reviewModal.isOpen}
        worker={reviewModal.worker}
        job={reviewModal.job}
        onClose={() => setReviewModal({ isOpen: false, worker: null, job: null })}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default EmployerJobsView;
