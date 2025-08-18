import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function WorkerApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
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
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading your applications...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 24 }}>
      <h2>My Job Applications</h2>
      
      {applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          <h3>No applications yet</h3>
          <p>Start applying for jobs to see your applications here!</p>
          <button 
            onClick={() => navigate('/jobs')}
            style={{ 
              background: '#007bff', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div>
          {applications.map((application) => (
            <div key={application._id} style={{ 
              background: '#fff', 
              marginBottom: 16, 
              padding: 20, 
              borderRadius: 8, 
              boxShadow: '0 2px 8px #eee',
              border: `2px solid ${getStatusColor(application.status)}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#333', marginBottom: 8 }}>
                    {application.job.category}
                  </h3>
                  
                  <div style={{ marginBottom: 16 }}>
                    <p><strong>Employer:</strong> {application.employer.name}</p>
                    <p><strong>Contact:</strong> {application.employer.contact}</p>
                    <p><strong>Working Hours:</strong> {application.job.workingHours}</p>
                    <p><strong>Salary:</strong> {application.job.salaryRange}</p>
                    <p><strong>Address:</strong> {application.job.address}</p>
                    <p><strong>Description:</strong> {application.job.description}</p>
                  </div>

                  {application.message && (
                    <div style={{ 
                      background: '#f8f9fa', 
                      padding: 12, 
                      borderRadius: 4, 
                      marginBottom: 16 
                    }}>
                      <p><strong>Your Message:</strong></p>
                      <p style={{ margin: 0, fontStyle: 'italic' }}>"{application.message}"</p>
                    </div>
                  )}

                  <p><strong>Applied:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                  
                  {application.assignedAt && (
                    <p><strong>Assigned:</strong> {new Date(application.assignedAt).toLocaleDateString()}</p>
                  )}
                </div>

                <div style={{ marginLeft: 20, textAlign: 'center', minWidth: 150 }}>
                  <div style={{ 
                    background: getStatusColor(application.status), 
                    color: 'white', 
                    padding: '8px 16px', 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    marginBottom: 12
                  }}>
                    {getStatusText(application.status)}
                  </div>

                  {application.status === 'assigned' && (
                    <div style={{ 
                      background: '#28a745', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      🎉 Congratulations!
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
} 