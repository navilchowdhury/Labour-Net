import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NotificationPanel({ isOpen, onClose, token }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && token) {
      fetchNotifications();
    }
  }, [isOpen, token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('http://localhost:5000/api/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '80px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '70vh',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#2d3e50' }}>Notifications</h3>
          <div>
            <button
              onClick={markAllAsRead}
              style={{
                background: '#3498db',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Mark All Read
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(70vh - 80px)' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div>Loading notifications...</div>
            </div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
              {error}
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
              No notifications yet
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #e2e8f0',
                  background: notification.isRead ? '#f8f9fa' : '#e3f2fd',
                  cursor: 'pointer'
                }}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <h4 style={{
                    margin: 0,
                    color: notification.isRead ? '#7f8c8d' : '#2d3e50',
                    fontSize: '16px'
                  }}>
                    {notification.title}
                  </h4>
                  {!notification.isRead && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#e74c3c'
                    }} />
                  )}
                </div>
                
                <p style={{
                  margin: '5px 0',
                  color: notification.isRead ? '#7f8c8d' : '#34495e',
                  fontSize: '14px'
                }}>
                  {notification.message}
                </p>
                
                {notification.job && (
                  <div style={{
                    background: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '10px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h5 style={{ margin: '0 0 10px 0', color: '#2d3e50' }}>
                      Job Details
                    </h5>
                    <div style={{ fontSize: '14px', color: '#34495e' }}>
                      <p><strong>Category:</strong> {notification.job.category}</p>
                      <p><strong>Working Hours:</strong> {notification.job.workingHours}</p>
                      <p><strong>Salary:</strong> {notification.job.salaryRange}</p>
                      <p><strong>Address:</strong> {notification.job.address}</p>
                      <p><strong>Description:</strong> {notification.job.description}</p>
                      {notification.job.employer && (
                        <p><strong>Employer:</strong> {notification.job.employer.name} ({notification.job.employer.contact})</p>
                      )}
                    </div>
                    
                    {/* Apply Button */}
                    <button
                      onClick={async () => {
                        try {
                          const response = await axios.post('http://localhost:5000/api/applications', {
                            job: notification.job._id,
                            coverLetter: `I'm interested in this ${notification.job.category} position. I have relevant experience and am available to start immediately.`
                          }, {
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          
                          if (response.status === 201) {
                            alert('Application submitted successfully!');
                            // Mark notification as read
                            markAsRead(notification._id);
                          }
                        } catch (err) {
                          console.error('Application error:', err);
                          alert('Failed to submit application. Please try again.');
                        }
                      }}
                      style={{
                        background: '#27ae60',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '15px',
                        fontWeight: '600'
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                )}
                
                <div style={{
                  fontSize: '12px',
                  color: '#95a5a6',
                  marginTop: '10px'
                }}>
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 