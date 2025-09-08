import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DirectChat from './DirectChat';
import '../styles/WorkerSearchPanel.css';

const WorkerSearchPanel = ({ user, onMessageWorker }) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    address: '',
    jobCategory: '',
    availability: ''
  });
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatWorker, setChatWorker] = useState(null);

  const jobCategories = ['Plumbing', 'Cooking', 'Painting', 'Electrical', 'Cleaning'];
  const availabilityOptions = ['full-time', 'part-time', 'weekends', 'flexible'];

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'employer') {
      searchWorkers();
    }
  }, []);

  const searchWorkers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filters.address) params.append('address', filters.address);
      if (filters.jobCategory) params.append('jobCategory', filters.jobCategory);
      if (filters.availability) params.append('availability', filters.availability);

      console.log('Searching workers with filters:', filters);
      const response = await axios.get(`http://localhost:5000/api/auth/search-workers?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Workers found:', response.data);
      setWorkers(response.data);
    } catch (error) {
      console.error('Error searching workers:', error);
      if (error.response?.status === 403) {
        alert('Only employers can search for workers. Please login as an employer.');
      } else {
        alert('Failed to search workers. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const viewWorkerProfile = async (workerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/auth/worker/${workerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedWorker(response.data);
    } catch (error) {
      console.error('Error fetching worker profile:', error);
    }
  };

  const handleMessageWorker = (worker) => {
    setChatWorker(worker);
    setShowChat(true);
    setSelectedWorker(null);
  };

  if (user?.role !== 'employer') {
    return (
      <div className="worker-search-panel">
        <p>Only employers can search for workers.</p>
      </div>
    );
  }

  return (
    <div className="worker-search-panel">
      <div className="search-header">
        <h2>Find Workers</h2>
        <p>Search for workers by location and skills</p>
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="Enter address..."
            value={filters.address}
            onChange={(e) => handleFilterChange('address', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Job Category</label>
          <select
            value={filters.jobCategory}
            onChange={(e) => handleFilterChange('jobCategory', e.target.value)}
          >
            <option value="">All Categories</option>
            {jobCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Availability</label>
          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
          >
            <option value="">Any Availability</option>
            {availabilityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <button onClick={searchWorkers} className="search-btn">
          Search Workers
        </button>
      </div>

      {loading ? (
        <div className="loading">Searching workers...</div>
      ) : (
        <div className="workers-grid">
          {workers.length === 0 ? (
            <p className="no-workers">No workers found matching your criteria.</p>
          ) : (
            workers.map(worker => (
              <div key={worker._id} className="worker-card">
                <div className="worker-info">
                  <h3>{worker.name}</h3>
                  <p className="location">📍 {worker.address || 'Address not specified'}</p>
                  <p className="availability">🕒 {worker.availability || 'Availability not specified'}</p>
                  
                  <div className="job-preferences">
                    <strong>Skills:</strong>
                    <div className="skills-tags">
                      {worker.jobPreferences?.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      )) || <span className="no-skills">No skills listed</span>}
                    </div>
                  </div>

                  {worker.isNidVerified && (
                    <div className="verification-badge">
                      ✅ NID Verified
                    </div>
                  )}
                </div>

                <div className="worker-actions">
                  <button 
                    onClick={() => viewWorkerProfile(worker._id)}
                    className="view-profile-btn"
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => handleMessageWorker(worker)}
                    className="message-btn"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedWorker && (
        <div className="worker-profile-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedWorker.name}'s Profile</h3>
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

              <div className="job-history">
                <h4>Recent Work History</h4>
                {selectedWorker.jobHistory && selectedWorker.jobHistory.length > 0 ? (
                  <div className="job-history-list">
                    {selectedWorker.jobHistory.slice(0, 3).map((job, index) => (
                      <div key={index} className="job-history-item">
                        <div className="job-info">
                          <span className="job-title">{job.jobTitle}</span>
                          <span className="job-employer">{job.employerName}</span>
                          {job.review && (
                            <div className="job-review">
                              <span className="rating">★ {job.review.rating}/5</span>
                              {job.review.comment && (
                                <span className="review-comment">"{job.review.comment}"</span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className={`job-status ${job.status}`}>{job.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No work history available</p>
                )}
                {selectedWorker.reviews && selectedWorker.reviews.total > 0 && (
                  <div className="worker-rating-summary">
                    <span className="average-rating">
                      ★ {selectedWorker.reviews.averageRating}/5 
                      ({selectedWorker.reviews.total} reviews)
                    </span>
                  </div>
                )}
              </div>

              {selectedWorker.workHistory?.length > 0 && (
                <div className="profile-section">
                  <h4>Experience Summary</h4>
                  <ul>
                    {selectedWorker.workHistory.map((work, index) => (
                      <li key={index}>{work}</li>
                    ))}
                  </ul>
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
                onClick={() => handleMessageWorker(selectedWorker)}
                className="message-btn"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Chat Integration */}
      {showChat && chatWorker && (
        <div className="chat-overlay">
          <div className="chat-container">
            <DirectChat 
              recipientId={chatWorker._id}
              recipientName={chatWorker.name}
              currentUser={{ 
                id: localStorage.getItem('userId') || JSON.parse(localStorage.getItem('user') || '{}').id,
                role: localStorage.getItem('role')
              }}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerSearchPanel;
