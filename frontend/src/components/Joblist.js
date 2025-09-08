import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApplicationModal from './ApplicationModal';
import JobFilters from './JobFilters';
import '../styles/professional.css';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    salary: '',
    location: '',
    minSalary: '',
    maxSalary: ''
  });

  // [ADDED] for review stars & reporting
  const [reviewData, setReviewData] = useState({});
  const [reporting, setReporting] = useState(false);
  const [workerReviews, setWorkerReviews] = useState({});
  const [showReviews, setShowReviews] = useState({});
  const [reviewComments, setReviewComments] = useState({});
  const [reportReasons, setReportReasons] = useState({});
  const [showReportForm, setShowReportForm] = useState({});
  
  // [RESTORED] for worker profile and work history
  const [workerProfiles, setWorkerProfiles] = useState({});
  const [showWorkerProfile, setShowWorkerProfile] = useState({});

  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      console.log('Current user:', parsedUser);
      
      // Fetch assigned jobs if user is a worker
      if (parsedUser.role === 'worker') {
        fetchAssignedJobs();
      }
    }
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  const fetchJobs = async (filterParams = {}) => {
    try {
      const params = new URLSearchParams();
      if (filterParams.category) params.append('category', filterParams.category);
      if (filterParams.salary) params.append('salary', filterParams.salary);
      if (filterParams.location) params.append('location', filterParams.location);
      if (filterParams.minSalary) params.append('minSalary', filterParams.minSalary);
      if (filterParams.maxSalary) params.append('maxSalary', filterParams.maxSalary);
      
      const url = params.toString() ? 
        `http://localhost:5000/api/jobs?${params}` : 
        'http://localhost:5000/api/jobs';
        
      const response = await axios.get(url, { headers });
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  const handleFilterChange = (field, value) => {
    if (field === 'reset') {
      const resetFilters = {
        category: '',
        salary: '',
        location: '',
        minSalary: '',
        maxSalary: ''
      };
      setFilters(resetFilters);
      fetchJobs(resetFilters);
    } else {
      const newFilters = { ...filters, [field]: value };
      setFilters(newFilters);
      fetchJobs(newFilters);
    }
  };

  const fetchAssignedJobs = async () => {
    try {
      console.log('Fetching assigned jobs with headers:', headers);
      const response = await axios.get('http://localhost:5000/api/applications/worker/assigned', { headers });
      console.log('Assigned jobs response:', response.data);
      setAssignedJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching assigned jobs:', error);
      console.error('Error response:', error.response?.data);
      setAssignedJobs([]);
    }
  };

  const handleApply = async (message) => {
    try {
      console.log('handleApply called with message:', message);
      console.log('selectedJob:', selectedJob);
      console.log('token exists:', !!token);
      console.log('headers:', headers);
      console.log('user data:', user);
      
      if (!token) {
        alert('Please login to apply');
        return;
      }
      
      if (!selectedJob || !selectedJob._id) {
        alert('No job selected. Please try again.');
        return;
      }
      
      console.log('Submitting application for job:', selectedJob._id);
      
      const requestData = { jobId: selectedJob._id, message };
      console.log('Request data:', requestData);
      
      await axios.post(
        'http://localhost:5000/api/applications/',
        requestData,
        { headers }
      );
      alert('Application submitted!');
      setModalOpen(false);
      setSelectedJob(null); // Reset selected job
      fetchJobs();
    } catch (err) {
      console.error('Application error:', err);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
      } else if (err.response?.status === 400) {
        alert(err.response.data.error || 'Bad request. Please check your input.');
      } else if (err.response?.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert(err.response?.data?.error || 'Failed to apply. Please try again.');
      }
    }
  };

  const handleAssignWorker = async (jobId, workerId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/applications/assign',
        { jobId, workerId },
        { headers }
      );
      alert('Worker assigned!');
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign');
    }
  };

  // [ADDED] Worker reports employer
  const handleReportEmployer = async (jobId) => {
    try {
      setReporting(true);
      const reason = reportReasons[jobId];
      
      if (!reason || reason.trim() === '') {
        alert('Please provide a reason for reporting the employer.');
        setReporting(false);
        return;
      }
      
      console.log('Reporting employer for job:', jobId, 'with reason:', reason);
      console.log('Headers:', headers);
      console.log('User data:', user);
      console.log('Request payload:', { jobId, reason: reason.trim() });
      
      const response = await axios.post(
        'http://localhost:5000/api/applications/report',
        { jobId, reason: reason.trim() },
        { headers }
      );
      console.log('Report response:', response.data);
      alert('Employer reported successfully!');
      setShowReportForm({ ...showReportForm, [jobId]: false });
      setReportReasons({ ...reportReasons, [jobId]: '' });
      fetchJobs();
      if (user?.role === 'worker') {
        fetchAssignedJobs();
      }
    } catch (err) {
      console.error('Report error:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error response status:', err.response?.status);
      if (err.response?.status === 400) {
        alert('Please provide a reason for reporting the employer.');
      } else if (err.response?.status === 403) {
        alert('You are not assigned to this job and cannot report the employer.');
      } else if (err.response?.status === 404) {
        alert('Job not found. Please refresh the page and try again.');
      } else {
        alert(`Failed to report employer: ${err.response?.data?.error || err.message}`);
      }
    } finally {
      setReporting(false);
    }
  };

  // [ADDED] Employer reviews worker
  const handleReviewWorker = async (jobId, workerId, rating) => {
    try {
      const comment = reviewComments[workerId] || '';
      console.log('Reviewing worker:', workerId, 'for job:', jobId, 'with rating:', rating);
      await axios.post(
        'http://localhost:5000/api/applications/review',
        { jobId, workerId, rating, comment },
        { headers }
      );
      alert('Review submitted!');
      setReviewData({ ...reviewData, [workerId]: rating });
      setReviewComments({ ...reviewComments, [workerId]: '' });
    } catch (err) {
      console.error('Review error:', err);
      alert(err.response?.data?.error || 'Failed to review');
    }
  };

  // [ADDED] Get worker reviews
  const handleGetWorkerReviews = async (workerId) => {
    try {
      if (workerReviews[workerId]) {
        setShowReviews({ ...showReviews, [workerId]: !showReviews[workerId] });
        return;
      }
      
      const response = await axios.get(
        `http://localhost:5000/api/applications/worker/${workerId}/reviews`,
        { headers }
      );
      setWorkerReviews({ ...workerReviews, [workerId]: response.data });
      setShowReviews({ ...showReviews, [workerId]: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch reviews');
    }
  };

  // [RESTORED] Get worker profile and work history
  const handleGetWorkerProfile = async (workerId) => {
    try {
      if (workerProfiles[workerId]) {
        setShowWorkerProfile({ ...showWorkerProfile, [workerId]: !showWorkerProfile[workerId] });
        return;
      }
      
      const response = await axios.get(
        `http://localhost:5000/api/applications/worker/${workerId}/profile`,
        { headers }
      );
      setWorkerProfiles({ ...workerProfiles, [workerId]: response.data });
      setShowWorkerProfile({ ...showWorkerProfile, [workerId]: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fetch worker profile');
    }
  };

  // const openApplicationModal = (job) => {
  //   setSelectedJob(job);
  //   setModalOpen(true);
  // };

  return (
    <div className="professional-container">
      <div className="professional-page-header">
        <h1 className="professional-page-title">Job Listings</h1>
      </div>
      
      {/* Job Filters */}
      <JobFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        userRole={user?.role}
      />
      <p className="professional-page-subtitle">Discover opportunities that match your skills and interests</p>
      
      {/* Assigned Jobs Section for Workers */}
      {user?.role === 'worker' && assignedJobs.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>🎯 Your Assigned Jobs</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Jobs you've been assigned to work on. You can report employers if needed.
          </p>
          {assignedJobs.map((job) => (
            <div key={job._id} className="professional-card job-card" style={{ marginBottom: '1rem' }}>
              <div className="professional-card-header">
                <div className="job-card-header">
                  <div>
                    <h3 className="job-title">{job.category} Position</h3>
                    <div className="status-badge status-assigned">Assigned to You</div>
                  </div>
                </div>
              </div>
              
              <div className="professional-card-body">
                <div className="job-details-grid">
                  <div className="job-detail-item">
                    <div className="job-detail-icon">👤</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Employer</p>
                      <p className="job-detail-value">{job.employer?.name}</p>
                    </div>
                  </div>
                  
                  <div className="job-detail-item">
                    <div className="job-detail-icon">📞</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Contact</p>
                      <p className="job-detail-value">{job.employer?.contact}</p>
                    </div>
                  </div>
                  
                  <div className="job-detail-item">
                    <div className="job-detail-icon">⏰</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Working Hours</p>
                      <p className="job-detail-value">{job.workingHours}</p>
                    </div>
                  </div>
                  
                  <div className="job-detail-item">
                    <div className="job-detail-icon">💰</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Salary</p>
                      <p className="job-detail-value">{job.salaryRange}</p>
                    </div>
                  </div>
                  
                  <div className="job-detail-item">
                    <div className="job-detail-icon">📍</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Address</p>
                      <p className="job-detail-value">{job.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="job-description">
                  <p className="job-description-text">{job.description}</p>
                </div>

                {/* Employer Reported Warning */}
            {job.employer?.reportedCount > 0 && (
                  <div className={`professional-alert ${job.employer.reportedCount >= 3 ? 'professional-alert-error' : 'professional-alert-warning'}`}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      {job.employer.reportedCount >= 3 ? '🚨' : '⚠️'} Employer Reported: {job.employer.reportedCount} time{job.employer.reportedCount > 1 ? 's' : ''}
                      {job.employer.reportedCount >= 3 && (
                        <span style={{ display: 'block', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 'normal' }}>
                          This employer has been reported multiple times. Please proceed with caution.
                        </span>
                      )}
                </p>
              </div>
            )}

                {/* Report Employer Button */}
                <div className="job-actions">
                    {!showReportForm[job._id] ? (
                      <button 
                        onClick={() => setShowReportForm({ ...showReportForm, [job._id]: true })}
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
                          value={reportReasons[job._id] || ''}
                          onChange={(e) => setReportReasons({ ...reportReasons, [job._id]: e.target.value })}
                            className="professional-form-input"
                          />
                        </div>
                        <div className="job-actions">
                          <button
                            onClick={() => handleReportEmployer(job._id)}
                            disabled={reporting || !reportReasons[job._id]}
                            className="professional-btn professional-btn-danger professional-btn-sm"
                          >
                            {reporting ? 'Reporting...' : 'Submit Report'}
                          </button>
                          <button
                            onClick={() => {
                              setShowReportForm({ ...showReportForm, [job._id]: false });
                              setReportReasons({ ...reportReasons, [job._id]: '' });
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
              </div>
            </div>
          ))}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">💼</div>
          <h3 className="empty-state-title">No Jobs Available</h3>
          <p className="empty-state-description">There are currently no job listings available. Check back later for new opportunities!</p>
        </div>
      ) : user?.role === 'worker' && (!user?.jobPreferences || user.jobPreferences.length === 0) ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚙️</div>
          <h3 className="empty-state-title">Set Your Job Preferences</h3>
          <p className="empty-state-description">
            To see relevant job opportunities, please update your profile and select your job preferences first.
          </p>
          <button 
            onClick={() => window.location.href = '/profile'}
            className="professional-btn professional-btn-primary professional-btn-lg"
          >
            Update Profile
          </button>
        </div>
      ) : (
        jobs.map((job) => {
          const isEmployer = user?.role === 'employer';
          const isWorker = user?.role === 'worker';
          
          // Check if job matches worker's preferences
          const jobMatchesWorker = isWorker && user?.jobPreferences && 
            user.jobPreferences.some(preference => 
              preference.toLowerCase() === job.category.toLowerCase()
            );
          
          // Debug logging for job data
          console.log('Job:', job._id, 'Assigned worker:', job.assignedWorker, 'Current user ID:', user?._id, 'User role:', user?.role);
          console.log('User object keys:', user ? Object.keys(user) : 'No user');
          console.log('User ID comparison:', String(job.assignedWorker), '===', String(user?._id));
          console.log('Job matches worker preferences:', jobMatchesWorker, 'Job category:', job.category, 'Worker preferences:', user?.jobPreferences);
          console.log('Job status:', job.status, 'Can report:', isWorker && job.status === 'assigned' && String(job.assignedWorker) === String(user?._id || user?.id));

          return (
            <div key={job._id} className={`professional-card job-card ${isWorker && !jobMatchesWorker ? 'job-card-no-match' : ''}`}>
              <div className="professional-card-header">
                <div className="job-card-header">
                  <div>
                    <h3 className="job-title">{job.category} Position</h3>
                    <div className="flex gap-2 items-center">
                      <div className="status-badge status-open">Open Position</div>
                      {isWorker && (
                        <div className={`status-badge ${jobMatchesWorker ? 'status-accepted' : 'status-rejected'}`}>
                          {jobMatchesWorker ? '✅ Matches Your Skills' : '❌ Not Your Specialty'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="professional-card-body">
                <div className="job-details-grid">
                  <div className="job-detail-item">
                    <div className="job-detail-icon">👤</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Employer</p>
                      <p className="job-detail-value">{job.employer?.name}</p>
                    </div>
                  </div>
                  
                  <div className="job-detail-item">
                    <div className="job-detail-icon">📞</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Contact</p>
                      <p className="job-detail-value">{job.employer?.contact}</p>
                    </div>
                  </div>
                  
                  <div className="job-detail-item">
                    <div className="job-detail-icon">⏰</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Working Hours</p>
                      <p className="job-detail-value">{job.workingHours}</p>
                    </div>
                  </div>
                  
                  <div className="job-detail-item">
                    <div className="job-detail-icon">💰</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Salary</p>
                      <p className="job-detail-value">{job.salaryRange}</p>
                    </div>
                  </div>
                  
                  <div className="job-detail-item">
                    <div className="job-detail-icon">📍</div>
                    <div className="job-detail-content">
                      <p className="job-detail-label">Address</p>
                      <p className="job-detail-value">{job.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="job-description">
                  <p className="job-description-text">{job.description}</p>
                </div>

                {/* Employer Reported Warning */}
                {job.employer?.reportedCount > 0 && (
                  <div className={`professional-alert ${job.employer.reportedCount >= 3 ? 'professional-alert-error' : 'professional-alert-warning'}`}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      {job.employer.reportedCount >= 3 ? '🚨' : '⚠️'} Employer Reported: {job.employer.reportedCount} time{job.employer.reportedCount > 1 ? 's' : ''}
                      {job.employer.reportedCount >= 3 && (
                        <span style={{ display: 'block', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: 'normal' }}>
                          This employer has been reported multiple times. Please proceed with caution.
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="job-actions">
                  {isWorker && jobMatchesWorker && (
                    <button 
                      onClick={() => {
                        console.log('Apply button clicked for job:', job);
                        setSelectedJob(job);
                        setModalOpen(true);
                      }}
                      className="professional-btn professional-btn-primary"
                    >
                      ✨ Apply Now
                    </button>
                  )}
                  
                  {isWorker && !jobMatchesWorker && (
                    <div className="professional-alert professional-alert-warning">
                      <p style={{ margin: 0, fontWeight: 'bold' }}>
                        ⚠️ This job doesn't match your current skill preferences. 
                        <br />
                        <small>Update your profile to include "{job.category}" in your job preferences to apply.</small>
                      </p>
              </div>
            )}

                  {/* Report Employer Button - Show for assigned workers */}
                  {isWorker && job.status === 'assigned' && String(job.assignedWorker) === String(user?._id || user?.id) && (
                    <div>
                      {!showReportForm[job._id] ? (
                        <button 
                          onClick={() => setShowReportForm({ ...showReportForm, [job._id]: true })}
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
                                value={reportReasons[job._id] || ''}
                                onChange={(e) => setReportReasons({ ...reportReasons, [job._id]: e.target.value })}
                                className="professional-form-input"
                              />
                            </div>
                            <div className="job-actions">
                              <button
                                onClick={() => handleReportEmployer(job._id)}
                                disabled={reporting || !reportReasons[job._id]}
                                className="professional-btn professional-btn-danger professional-btn-sm"
                              >
                                {reporting ? 'Reporting...' : 'Submit Report'}
                              </button>
                              <button
                                onClick={() => {
                                  setShowReportForm({ ...showReportForm, [job._id]: false });
                                  setReportReasons({ ...reportReasons, [job._id]: '' });
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

              {/* Applications Section for Employers */}
            {isEmployer && job.applications?.length > 0 && (
                <div className="professional-card-footer">
                  <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>📋 Applications ({job.applications.length})</h4>
                  {job.applications.map((app) => (
                    <div key={app._id} className="professional-card" style={{ marginBottom: '1rem' }}>
                      <div className="professional-card-body">
                        <div className="flex justify-between items-center mb-2">
              <div>
                            <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>👤 {app.worker?.name}</h5>
                            <div className="status-badge status-pending">{app.status}</div>
                          </div>
                          <div className="job-actions">
                     <button 
                       onClick={() => handleGetWorkerProfile(app.worker?._id)}
                              className="professional-btn professional-btn-secondary professional-btn-sm"
                     >
                       {showWorkerProfile[app.worker?._id] ? 'Hide Profile' : 'View Profile'}
                     </button>
                     
                     <button 
                       onClick={() => handleGetWorkerReviews(app.worker?._id)}
                              className="professional-btn professional-btn-secondary professional-btn-sm"
                     >
                       {showReviews[app.worker?._id] ? 'Hide Reviews' : 'View Reviews'}
                     </button>
                          </div>
                        </div>
                    
                                         {showReviews[app.worker?._id] && workerReviews[app.worker?._id] && (
                          <div className="professional-alert professional-alert-info" style={{ marginTop: '1rem' }}>
                            <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold' }}>
                           ⭐ Average Rating: {workerReviews[app.worker?._id].averageRating}/5 
                           ({workerReviews[app.worker?._id].totalReviews} reviews)
                         </p>
                         {workerReviews[app.worker?._id].reviews.slice(0, 3).map((review, idx) => (
                           <div key={idx} style={{ 
                                borderBottom: '1px solid var(--border-light)', 
                                paddingBottom: '0.5rem', 
                                marginBottom: '0.5rem' 
                              }}>
                                <div style={{ color: '#fbbf24', fontSize: '1.2rem' }}>
                               {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                             </div>
                                {review.comment && <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{review.comment}</p>}
                           </div>
                         ))}
                       </div>
                     )}

                        {/* Worker Profile and Work History Display */}
                     {showWorkerProfile[app.worker?._id] && workerProfiles[app.worker?._id] && (
                          <div className="professional-alert professional-alert-info" style={{ marginTop: '1rem' }}>
                            <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>👷 Worker Profile</h5>
                         
                         {/* Basic Info */}
                            <div className="job-details-grid" style={{ marginBottom: '1rem' }}>
                              <div className="job-detail-item">
                                <div className="job-detail-icon">📞</div>
                                <div className="job-detail-content">
                                  <p className="job-detail-label">Contact</p>
                                  <p className="job-detail-value">{workerProfiles[app.worker?._id].worker?.contact || 'N/A'}</p>
                                </div>
                              </div>
                              
                              <div className="job-detail-item">
                                <div className="job-detail-icon">✅</div>
                                <div className="job-detail-content">
                                  <p className="job-detail-label">NID Verified</p>
                                  <p className="job-detail-value">{workerProfiles[app.worker?._id].worker?.nidVerified ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                              
                              <div className="job-detail-item">
                                <div className="job-detail-icon">⏰</div>
                                <div className="job-detail-content">
                                  <p className="job-detail-label">Availability</p>
                                  <p className="job-detail-value">{workerProfiles[app.worker?._id].worker?.availability || 'N/A'}</p>
                                </div>
                              </div>
                         </div>

                         {/* Job Preferences */}
                         {workerProfiles[app.worker?._id].worker?.jobPreferences?.length > 0 && (
                              <div style={{ marginBottom: '1rem' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Job Preferences:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                               {workerProfiles[app.worker?._id].worker.jobPreferences.map((pref, idx) => (
                                    <span key={idx} className="status-badge status-open" style={{ fontSize: '0.75rem' }}>
                                   {pref}
                                 </span>
                               ))}
                             </div>
                           </div>
                         )}

                         {/* Work History */}
                         {workerProfiles[app.worker?._id].history?.length > 0 && (
                           <div>
                                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Previous Work History:</p>
                             {workerProfiles[app.worker?._id].history.slice(0, 3).map((job, idx) => (
                                  <div key={idx} className="professional-card" style={{ marginBottom: '0.5rem' }}>
                                    <div className="professional-card-body" style={{ padding: '0.75rem' }}>
                                      <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                   {job.job?.category} - {job.job?.employer?.name}
                                 </p>
                                      <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                   {job.job?.workingHours} • {job.job?.salaryRange} • {job.job?.address}
                                 </p>
                                      <p style={{ margin: '0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                   Status: {job.status} • {new Date(job.createdAt).toLocaleDateString()}
                                 </p>
                                    </div>
                               </div>
                             ))}
                           </div>
                         )}
                       </div>
                     )}
                    
                        <div className="job-actions" style={{ marginTop: '1rem' }}>
                    {job.status === 'open' && (
                            <button 
                              onClick={() => handleAssignWorker(job._id, app.worker?._id)}
                              className="professional-btn professional-btn-success"
                            >
                              ✅ Assign Worker
                            </button>
                          )}

                          {/* Review worker after assignment */}
                    {job.status === 'assigned' && String(job.assignedWorker) === String(app.worker?._id || app.worker?.id) && (
                            <div className="professional-card" style={{ marginTop: '1rem' }}>
                              <div className="professional-card-body">
                                <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', color: 'var(--text-primary)' }}>⭐ Review this worker:</p>
                                <div style={{ marginBottom: '1rem' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              style={{
                                        color: reviewData[app.worker?._id] >= star ? '#fbbf24' : '#d1d5db',
                                        fontSize: '1.5rem',
                                        marginRight: '0.5rem',
                                background: 'none',
                                border: 'none',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s ease'
                              }}
                              onClick={() => setReviewData({ ...reviewData, [app.worker?._id]: star })}
                                      onMouseEnter={(e) => e.target.style.color = '#fbbf24'}
                                      onMouseLeave={(e) => e.target.style.color = reviewData[app.worker?._id] >= star ? '#fbbf24' : '#d1d5db'}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                                <div className="professional-form-group">
                        <input
                          type="text"
                          placeholder="Add a comment (optional)"
                          value={reviewComments[app.worker?._id] || ''}
                          onChange={(e) => setReviewComments({ ...reviewComments, [app.worker?._id]: e.target.value })}
                                    className="professional-form-input"
                                  />
                                </div>
                        <button
                          onClick={() => handleReviewWorker(job._id, app.worker?._id, reviewData[app.worker?._id] || 0)}
                          disabled={!reviewData[app.worker?._id]}
                                  className="professional-btn professional-btn-success"
                        >
                          Submit Review
                        </button>
                              </div>
                      </div>
                    )}
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        })
      )}

      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => {
          console.log('Modal closing');
          setModalOpen(false);
          setSelectedJob(null);
        }}
        onSubmit={handleApply}
        jobTitle={selectedJob?.category}
      />
    </div>
  );
}