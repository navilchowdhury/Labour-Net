import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WorkerProfileModal({ worker, isOpen, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [currentWorker, setCurrentWorker] = useState(worker);
  const [refreshing, setRefreshing] = useState(false);

  // Update currentWorker when worker prop changes
  useEffect(() => {
    if (worker) {
      setCurrentWorker(worker);
    }
  }, [worker]);

  // Refresh worker data
  const refreshWorkerData = async () => {
    if (!worker?._id) return;
    
    try {
      setRefreshing(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/auth/worker/${worker._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentWorker(response.data);
      if (onRefresh) {
        onRefresh(response.data);
      }
    } catch (error) {
      console.error('Error refreshing worker data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (!isOpen || !worker) return null;

  const formatDate = (date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const getWorkerInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'W';
  };

  const getVerificationBadge = (isVerified) => {
    if (isVerified) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.375rem 0.75rem',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          fontSize: '0.875rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          ✅ Verified Worker
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.375rem 0.75rem',
        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: 'white',
        borderRadius: 'var(--radius-xl)',
        fontSize: '0.875rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        ⏳ Verification Pending
      </span>
    );
  };

  const getStarRating = (rating) => {
    // Ensure rating is a valid number between 0 and 5
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('✨');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars.join(' ');
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
  const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:5000/api/messages/send', {
        receiverId: currentWorker._id,
        content: message.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Message sent successfully:', response.data);
      
      setMessage('');
      setShowMessageForm(false);
      alert('Message sent successfully! The worker will be notified.');
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.';
      alert(errorMessage);
    } finally {
          setLoading(false);
        }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--surface-color)',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            {getWorkerInitials(currentWorker.name)}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: '700',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {currentWorker.name || 'Unknown Worker'}
              </h2>
              {getVerificationBadge(currentWorker.isNidVerified)}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '1rem',
              opacity: 0.9
            }}>
              <span>👤 {currentWorker.sex ? currentWorker.sex.charAt(0).toUpperCase() + currentWorker.sex.slice(1) : 'Not specified'}</span>
              <span>🎂 {getAge(currentWorker.dob)} years old</span>
              <span>📅 Member since {formatDate(currentWorker.createdAt)}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={refreshWorkerData}
              disabled={refreshing}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                color: 'white',
                transition: 'background 0.2s ease',
                opacity: refreshing ? 0.6 : 1
              }}
              onMouseEnter={(e) => !refreshing && (e.target.style.background = 'rgba(255, 255, 255, 0.3)')}
              onMouseLeave={(e) => !refreshing && (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
              title="Refresh worker data"
            >
              {refreshing ? '⟳' : '🔄'}
            </button>
            
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.25rem',
                color: 'white',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          background: 'var(--background-color)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                background: activeTab === tab.id ? 'var(--surface-color)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                borderBottom: activeTab === tab.id ? '2px solid var(--primary-color)' : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '2rem'
        }}>
          {activeTab === 'overview' && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                {/* Contact Information */}
                <div className="professional-card">
                  <div className="professional-card-header">
                    <h3 style={{ margin: 0 }}>📞 Contact Information</h3>
                  </div>
                  <div className="professional-card-body">
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Phone:</strong> {currentWorker.contact || 'Not provided'}
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Address:</strong> {currentWorker.address || 'Not specified'}
                    </div>
                    <div>
                      <strong>Date of Birth:</strong> {formatDate(currentWorker.dob)}
                    </div>
                  </div>
                </div>

                {/* Skills & Preferences */}
                <div className="professional-card">
                  <div className="professional-card-header">
                    <h3 style={{ margin: 0 }}>🛠️ Skills & Preferences</h3>
                  </div>
                  <div className="professional-card-body">
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Job Preferences:</strong>
                      <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {currentWorker.jobPreferences && currentWorker.jobPreferences.length > 0 ? (
                          currentWorker.jobPreferences.map((pref, index) => (
                            <span
                              key={index}
                              style={{
                                padding: '0.25rem 0.75rem',
                                background: 'var(--primary-color)',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                textTransform: 'capitalize'
                              }}
                            >
                              {pref}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No preferences specified
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <strong>Availability:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{
                          padding: '0.375rem 0.75rem',
                          background: 'var(--success-color)',
                          color: 'white',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {currentWorker.availability || 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              {/* Work History from user.workHistory */}
              {currentWorker.workHistory && (() => {
                try {
                  const workHistory = JSON.parse(currentWorker.workHistory);
                  if (workHistory.length > 0) {
                    return (
                      <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                          💼 Completed Work Experience
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {workHistory.map((job, index) => (
                            <div key={index} style={{
                              background: '#f8f9fa',
                              padding: '16px',
                              borderRadius: '12px',
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  background: '#3182ce',
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: '16px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  textTransform: 'uppercase'
                                }}>
                                  {job.jobCategory}
                                </div>
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px',
                                  fontSize: '14px',
                                  color: '#4a5568'
                                }}>
                                  <span>📍</span>
                                  <span>{job.location}</span>
                                </div>
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px',
                                  fontSize: '12px',
                                  color: '#718096'
                                }}>
                                  <span>📅</span>
                                  <span>{new Date(job.completedDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div style={{
                                background: '#38a169',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}>
                                ✓ Completed
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                } catch (e) {
                  // If it's not valid JSON, show as plain text
                  return (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                        📋 Work History
                      </h3>
                      <div className="professional-card">
                        <div className="professional-card-body">
                          <p style={{
                            margin: 0,
                            color: 'var(--text-primary)',
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {currentWorker.workHistory}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Job History from applications */}
              {currentWorker.jobHistory && Array.isArray(currentWorker.jobHistory) && currentWorker.jobHistory.length > 0 ? (
                <div>
                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                    💼 Job Experience
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {currentWorker.jobHistory.filter(job => job && typeof job === 'object').map((job, index) => (
                      <div key={index} className="professional-card">
                        <div className="professional-card-body">
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                                {job.jobTitle || 'Unknown Job'}
                              </h4>
                              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>
                                {job.employerName || 'Unknown Employer'} {job.isCompany && '(Company)'}
                              </p>
                              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                <span>📍 {job.location || 'Not specified'}</span>
                                <span>💰 {job.salary || 'Not specified'}</span>
                                <span>📅 {job.assignedDate ? formatDate(job.assignedDate) : 'Unknown date'}</span>
                              </div>
                            </div>
                            <span className={`status-badge status-${job.status || 'unknown'}`}>
                              {(job.status || 'unknown').charAt(0).toUpperCase() + (job.status || 'unknown').slice(1)}
                            </span>
                          </div>
                          
                          {job.review && job.review.rating && (
                            <div style={{
                              padding: '1rem',
                              background: 'var(--background-color)',
                              borderRadius: 'var(--radius-md)',
                              borderLeft: '4px solid var(--accent-color)'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.5rem'
                              }}>
                                <span style={{ fontSize: '1rem' }}>
                                  {getStarRating(job.review.rating)}
                                </span>
                                <span style={{ fontWeight: '600' }}>
                                  {job.review.rating || 0}/5
                                </span>
                              </div>
                              {job.review.comment && job.review.comment.trim() && (
                                <p style={{ margin: 0, fontStyle: 'italic' }}>
                                  "{job.review.comment}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">💼</div>
                  <h3 className="empty-state-title">No Job Experience</h3>
                  <p className="empty-state-description">
                    This worker hasn't completed any jobs yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {currentWorker.reviews && (currentWorker.reviews.total || 0) > 0 ? (
                <div>
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: 'var(--background-color)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                      {getStarRating(currentWorker.reviews.averageRating || 0)}
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                      {currentWorker.reviews.averageRating || 0}/5
                    </h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                      Based on {currentWorker.reviews.total || 0} review{(currentWorker.reviews.total || 0) !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                    Recent Reviews
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(currentWorker.reviews.recentReviews || []).map((review, index) => (
                      <div key={index} className="professional-card">
                        <div className="professional-card-body">
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '1rem'
                          }}>
                            <div>
                              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                                {review.employer?.name || 'Unknown Employer'} {review.employer?.isCompany && '(Company)'}
                              </h4>
                              <p style={{ margin: '0', color: 'var(--text-secondary)' }}>
                                {review.job ? `${review.job.category} - ${review.job.title}` : 'Job details not available'}
                              </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                                {getStarRating(review.rating)}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {formatDate(review.createdAt)}
                              </div>
                            </div>
                          </div>
                          
                          {review.comment && (
                            <div style={{
                              padding: '1rem',
                              background: 'var(--background-color)',
                              borderRadius: 'var(--radius-md)',
                              borderLeft: '4px solid var(--primary-color)'
                            }}>
                              <p style={{ margin: 0, fontStyle: 'italic' }}>
                                "{review.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">⭐</div>
                  <h3 className="empty-state-title">No Reviews Yet</h3>
                  <p className="empty-state-description">
                    This worker hasn't received any reviews yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1.5rem 2rem',
          background: 'var(--background-color)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          {!showMessageForm ? (
            <>
              <button
                onClick={onClose}
                className="professional-btn professional-btn-secondary"
              >
                Close
              </button>
              <button
                onClick={() => setShowMessageForm(true)}
                className="professional-btn professional-btn-primary"
              >
                💬 Send Message
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to this worker..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setShowMessageForm(false)}
                  className="professional-btn professional-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !message.trim()}
                  className="professional-btn professional-btn-primary"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}