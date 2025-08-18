import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ApplicationModal from './ApplicationModal';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState('');
  const [salary, setSalary] = useState('');
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState({});
  const [showApplications, setShowApplications] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Modern color scheme
  const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#48bb78',
    warning: '#ed8936',
    danger: '#f56565',
    info: '#4299e1',
    light: '#f7fafc',
    dark: '#2d3748',
    gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    gradient5: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  };

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('=== USER DATA DEBUG ===');
      console.log('Raw user data from localStorage:', userData);
      console.log('Parsed user object:', parsedUser);
      console.log('User role:', parsedUser.role);
      console.log('User job preferences:', parsedUser.jobPreferences);
      console.log('Job preferences type:', typeof parsedUser.jobPreferences);
      console.log('Job preferences length:', parsedUser.jobPreferences?.length);
      console.log('=== END USER DEBUG ===');
      setUser(parsedUser);
    }

    fetchJobs();
  }, [category, salary]);

  const fetchJobs = async () => {
    try {
      let url = 'http://localhost:5000/api/jobs';
      const params = [];
      if (category) params.push(`category=${category}`);
      if (salary) params.push(`salary=${salary}`);
      if (params.length) url += '?' + params.join('&');
      
      const response = await axios.get(url);
      setJobs(response.data);
      
      // Fetch applications for each job if user is logged in
      if (user) {
        fetchApplications(response.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  const fetchApplications = async (jobsList) => {
    if (user?.role === 'employer') {
      console.log('Fetching applications for employer:', user.id);
      const apps = {};
      for (const job of jobsList) {
        console.log('Checking job:', job._id, 'employer:', job.employer?._id);
        if (job.employer?._id.toString() === user.id) {
          console.log('Found job owned by employer, fetching applications...');
          try {
            const response = await axios.get(`http://localhost:5000/api/applications/job/${job._id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Applications received for job:', job._id, response.data);
            apps[job._id] = response.data;
          } catch (error) {
            console.error('Error fetching applications:', error);
            apps[job._id] = [];
          }
        }
      }
      console.log('All applications fetched:', apps);
      setApplications(apps);
    }
  };

  const handleApply = async (message) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to apply for jobs');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/applications/apply', {
        jobId: selectedJob._id,
        message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Application submitted successfully!');
      
      // Refresh jobs and applications
      await fetchJobs();
      if (user?.role === 'employer') {
        await fetchApplications(jobs);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error applying for job');
    }
  };

  const openApplicationModal = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleAssignWorker = async (jobId, workerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/applications/assign', {
        jobId,
        workerId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Worker assigned successfully!');
      fetchJobs(); // Refresh jobs
    } catch (error) {
      alert(error.response?.data?.message || 'Error assigning worker');
    }
  };

  const getApplicationStatus = (jobId) => {
    if (!user || user.role !== 'worker') return null;
    
    // Check if user has applied for this job
    const job = jobs.find(j => j._id === jobId);
    if (job?.applications) {
      const userApplication = job.applications.find(app => app.worker.toString() === user.id);
      return userApplication?.status || null;
    }
    return null;
  };

  const renderApplyButton = (job) => {
    if (!user || user.role !== 'worker') return null;
    
    console.log('=== EXPERTISE MATCHING DEBUG ===');
    console.log('Job category:', job.category);
    console.log('Job category type:', typeof job.category);
    console.log('User job preferences:', user.jobPreferences);
    console.log('User job preferences type:', typeof user.jobPreferences);
    console.log('User job preferences length:', user.jobPreferences?.length);
    
    if (user.jobPreferences && user.jobPreferences.length > 0) {
      user.jobPreferences.forEach((pref, index) => {
        console.log(`Preference ${index}:`, pref, 'Type:', typeof pref);
        console.log(`Comparing: "${pref.toLowerCase()}" === "${job.category.toLowerCase()}"`);
        console.log(`Match result:`, pref.toLowerCase() === job.category.toLowerCase());
      });
    }
    
    const canApply = (() => {
      // Safety checks
      if (!user.jobPreferences) {
        console.log('No job preferences found');
        return false;
      }
      
      if (!Array.isArray(user.jobPreferences)) {
        console.log('Job preferences is not an array:', user.jobPreferences);
        return false;
      }
      
      if (user.jobPreferences.length === 0) {
        console.log('Job preferences array is empty');
        return false;
      }
      
      // Try exact match first
      const exactMatch = user.jobPreferences.some(pref => 
        pref === job.category
      );
      if (exactMatch) {
        console.log('Exact match found');
        return true;
      }
      
      // Try case-insensitive match
      const caseInsensitiveMatch = user.jobPreferences.some(pref => 
        pref.toLowerCase() === job.category.toLowerCase()
      );
      if (caseInsensitiveMatch) {
        console.log('Case-insensitive match found');
        return true;
      }
      
      // Try partial match (in case there are extra spaces or formatting)
      const partialMatch = user.jobPreferences.some(pref => 
        pref.toLowerCase().trim() === job.category.toLowerCase().trim()
      );
      if (partialMatch) {
        console.log('Partial match found after trimming');
        return true;
      }
      
      console.log('No matches found');
      return false;
    })();
    console.log('Final canApply result:', canApply);
    console.log('=== END DEBUG ===');
    
    const applicationStatus = getApplicationStatus(job._id);
    
    if (applicationStatus === 'assigned') {
      return (
        <div style={{ 
          background: colors.gradient4, 
          color: 'white', 
          padding: '12px 20px', 
          borderRadius: '25px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)'
        }}>
          🎯 Assigned to you!
        </div>
      );
    } else if (applicationStatus === 'accepted') {
      return (
        <div style={{ 
          background: colors.gradient3, 
          color: 'white', 
          padding: '12px 20px', 
          borderRadius: '25px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)'
        }}>
          ✓ Application Accepted
        </div>
      );
    } else if (applicationStatus === 'rejected') {
      return (
        <div style={{ 
          background: colors.gradient2, 
          color: 'white', 
          padding: '12px 20px', 
          borderRadius: '25px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
        }}>
          ✗ Application Rejected
        </div>
      );
    } else if (applicationStatus === 'pending') {
      return (
        <div style={{ 
          background: colors.gradient5, 
          color: 'white', 
          padding: '12px 20px', 
          borderRadius: '25px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(250, 112, 154, 0.3)'
        }}>
          ⏳ Application Pending
        </div>
      );
    } else {
      // Check if worker's expertise matches job category
      const canApply = (() => {
        // Safety checks
        if (!user.jobPreferences) {
          console.log('No job preferences found');
          return false;
        }
        
        if (!Array.isArray(user.jobPreferences)) {
          console.log('Job preferences is not an array:', user.jobPreferences);
          return false;
        }
        
        if (user.jobPreferences.length === 0) {
          console.log('Job preferences array is empty');
          return false;
        }
        
        // Try exact match first
        const exactMatch = user.jobPreferences.some(pref => 
          pref === job.category
        );
        if (exactMatch) {
          console.log('Exact match found');
          return true;
        }
        
        // Try case-insensitive match
        const caseInsensitiveMatch = user.jobPreferences.some(pref => 
          pref.toLowerCase() === job.category.toLowerCase()
        );
        if (caseInsensitiveMatch) {
          console.log('Case-insensitive match found');
          return true;
        }
        
        // Try partial match (in case there are extra spaces or formatting)
        const partialMatch = user.jobPreferences.some(pref => 
          pref.toLowerCase().trim() === job.category.toLowerCase().trim()
        );
        if (partialMatch) {
          console.log('Partial match found after trimming');
          return true;
        }
        
        console.log('No matches found');
        return false;
      })();
      if (canApply) {
        return (
          <button 
            onClick={() => openApplicationModal(job)}
            style={{ 
              background: colors.gradient1, 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '25px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
             Apply for Job
          </button>
        );
      } else {
        return (
          <div style={{ 
            background: '#e2e8f0', 
            color: '#64748b', 
            padding: '12px 20px', 
            borderRadius: '25px',
            fontWeight: 'bold',
            textAlign: 'center',
            border: '2px dashed #cbd5e1'
          }}>
            ⚠️ Expertise doesn't match
          </div>
        );
      }
    }
  };

  const renderEmployerControls = (job) => {
    if (!user || user.role !== 'employer' || job.employer?._id.toString() !== user.id) return null;

    const jobApplications = applications[job._id] || [];
    const hasApplications = jobApplications.length > 0;

    return (
      <div style={{ 
        marginTop: 20, 
        padding: '20px',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        borderRadius: '15px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ 
          margin: '0 0 15px 0', 
          color: colors.dark,
          fontSize: '18px',
          fontWeight: '600'
        }}>
          📋 Applications ({jobApplications.length})
        </h4>
        {hasApplications ? (
          <div>
            <button 
              onClick={() => setShowApplications({ ...showApplications, [job._id]: !showApplications[job._id] })}
              style={{ 
                background: colors.gradient4, 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '20px', 
                cursor: 'pointer',
                marginBottom: 15,
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 20px rgba(67, 233, 123, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(67, 233, 123, 0.3)';
              }}
            >
              {showApplications[job._id] ? '👁️ Hide Applications' : '👁️ View Applications'}
            </button>
            
            {showApplications[job._id] && (
              <div style={{ marginTop: 15 }}>
                {jobApplications.map((app, index) => (
                  <div key={app._id} style={{ 
                    border: '1px solid #e2e8f0', 
                    padding: '20px', 
                    marginBottom: '15px', 
                    borderRadius: '12px',
                    background: 'white',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ 
                          margin: '0 0 10px 0', 
                          color: colors.primary,
                          fontSize: '16px',
                          fontWeight: '600'
                        }}>
                          👤 {app.worker.name}
                        </h5>
                        <p style={{ margin: '5px 0', color: colors.dark }}><strong>📞 Contact:</strong> {app.worker.contact}</p>
                        <p style={{ margin: '5px 0', color: colors.dark }}><strong>🛠️ Expertise:</strong> {app.worker.jobPreferences.join(', ')}</p>
                        <p style={{ margin: '5px 0', color: colors.dark }}><strong>⏰ Availability:</strong> {app.worker.availability}</p>
                        <p style={{ margin: '5px 0', color: colors.dark }}><strong>📊 Status:</strong> 
                          <span style={{ 
                            color: app.status === 'pending' ? colors.warning : 
                                   app.status === 'accepted' ? colors.success : 
                                   app.status === 'rejected' ? colors.danger : colors.info,
                            fontWeight: 'bold',
                            marginLeft: 8
                          }}>
                            {app.status.toUpperCase()}
                          </span>
                        </p>
                        {app.message && (
                          <div style={{ 
                            background: '#f7fafc', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            marginTop: '10px',
                            borderLeft: `4px solid ${colors.primary}`
                          }}>
                            <p style={{ margin: 0, fontStyle: 'italic', color: colors.dark }}>
                              💬 "{app.message}"
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {job.status === 'open' && app.status === 'pending' && (
                        <button 
                          onClick={() => handleAssignWorker(job._id, app.worker._id)}
                          style={{ 
                            background: colors.gradient4, 
                            color: 'white', 
                            border: 'none', 
                            padding: '10px 20px', 
                            borderRadius: '20px', 
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 6px 20px rgba(67, 233, 123, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 15px rgba(67, 233, 123, 0.3)';
                          }}
                        >
                          ✅ Assign Worker
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: '#64748b',
            fontStyle: 'italic'
          }}>
            📭 No applications yet
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      maxWidth: 1000, 
      margin: 'auto', 
      padding: '30px 20px',
      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      minHeight: '100vh'
    }}>
      <div style={{ 
        background: colors.gradient1, 
        padding: '30px', 
        borderRadius: '20px', 
        marginBottom: '30px',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
           Job Listings
        </h1>
        <p style={{ 
          margin: '10px 0 0 0', 
          fontSize: '1.1rem', 
          opacity: 0.9 
        }}>
          Find your next opportunity or post a job
        </p>
      </div>
      
      
      
      {/* Refresh button for employers */}
      {user?.role === 'employer' && (
        <div style={{ marginBottom: '25px', textAlign: 'right' }}>
          <button 
            onClick={() => fetchApplications(jobs)}
            style={{ 
              background: colors.gradient3, 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '25px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.3)';
            }}
          >
            🔄 Refresh Applications
          </button>
        </div>
      )}
      
      {/* Filters */}
      <div style={{ 
        background: 'white', 
        padding: '25px', 
        borderRadius: '15px', 
        marginBottom: '30px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: colors.dark,
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          🔍 Filter Jobs
        </h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            style={{ 
              padding: '12px 20px', 
              borderRadius: '10px', 
              border: '2px solid #e2e8f0',
              fontSize: '14px',
              minWidth: '150px',
              background: 'white',
              color: colors.dark
            }}
          >
            <option value="">All Categories</option>
            <option value="plumbing">🔧 Plumbing</option>
            <option value="cleaning">🧹 Cleaning</option>
            <option value="electrical">⚡ Electrical</option>
            <option value="cooking">👨‍🍳 Cooking</option>
            <option value="painting">🎨 Painting</option>
          </select>
          <input 
            placeholder="💰 Salary Range" 
            value={salary} 
            onChange={e => setSalary(e.target.value)}
            style={{ 
              padding: '12px 20px', 
              borderRadius: '10px', 
              border: '2px solid #e2e8f0',
              fontSize: '14px',
              minWidth: '200px',
              background: 'white',
              color: colors.dark
            }}
          />
        </div>
      </div>
      
      {/* Jobs List */}
      <div>
        {jobs.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: colors.dark, marginBottom: '10px' }}>No jobs found</h3>
            <p style={{ color: '#64748b' }}>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          jobs.map((job, index) => (
            <div key={job._id} style={{ 
              background: 'white', 
              marginBottom: '25px', 
              padding: '30px', 
              borderRadius: '20px', 
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    background: colors.gradient1, 
                    color: 'white', 
                    padding: '8px 20px', 
                    borderRadius: '20px',
                    display: 'inline-block',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    🏷️ {job.category.toUpperCase()}
                  </div>
                  
                  <h3 style={{ 
                    margin: '0 0 15px 0', 
                    color: colors.dark,
                    fontSize: '1.5rem',
                    fontWeight: '600'
                  }}>
                    {job.category} Position
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ 
                      background: '#f7fafc', 
                      padding: '15px', 
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <p style={{ margin: '0 0 5px 0', color: colors.primary, fontWeight: '600' }}>👤 Employer</p>
                      <p style={{ margin: 0, color: colors.dark }}>{job.employer?.name}</p>
                    </div>
                    <div style={{ 
                      background: '#f7fafc', 
                      padding: '15px', 
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <p style={{ margin: '0 0 5px 0', color: colors.primary, fontWeight: '600' }}>📞 Contact</p>
                      <p style={{ margin: 0, color: colors.dark }}>{job.employer?.contact || 'Contact not available'}</p>
                    </div>
                    <div style={{ 
                      background: '#f7fafc', 
                      padding: '15px', 
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <p style={{ margin: '0 0 5px 0', color: colors.primary, fontWeight: '600' }}>⏰ Working Hours</p>
                      <p style={{ margin: 0, color: colors.dark }}>{job.workingHours}</p>
                    </div>
                    <div style={{ 
                      background: '#f7fafc', 
                      padding: '15px', 
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <p style={{ margin: '0 0 5px 0', color: colors.primary, fontWeight: '600' }}>💰 Salary</p>
                      <p style={{ margin: 0, color: colors.dark }}>{job.salaryRange}</p>
                    </div>
                  </div>
                  
                  <div style={{ 
                    background: '#f7fafc', 
                    padding: '15px', 
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '15px'
                  }}>
                    <p style={{ margin: '0 0 5px 0', color: colors.primary, fontWeight: '600' }}>📍 Address</p>
                    <p style={{ margin: 0, color: colors.dark }}>{job.address}</p>
                  </div>
                  
                  <div style={{ 
                    background: '#f7fafc', 
                    padding: '15px', 
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '15px'
                  }}>
                    <p style={{ margin: '0 0 5px 0', color: colors.primary, fontWeight: '600' }}>📝 Description</p>
                    <p style={{ margin: 0, color: colors.dark }}>{job.description}</p>
                  </div>
                  
                  <div style={{ 
                    background: colors.gradient4, 
                    color: 'white', 
                    padding: '8px 20px', 
                    borderRadius: '20px',
                    display: 'inline-block',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    🟢 {job.status.toUpperCase()}
                  </div>
                </div>
                
                <div style={{ marginLeft: '25px', minWidth: '150px' }}>
                  {renderApplyButton(job)}
                </div>
              </div>
              
              {renderEmployerControls(job)}
            </div>
          ))
        )}
      </div>

      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleApply}
        jobTitle={selectedJob?.category}
      />
    </div>
  );
}