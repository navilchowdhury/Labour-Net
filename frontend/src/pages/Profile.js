import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('Fetching profile with token:', token);
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile response:', response.data);
        setUser(response.data);
        setEditForm({
          name: response.data.name,
          contact: response.data.contact,
          address: response.data.address,
          dob: response.data.dob ? new Date(response.data.dob).toISOString().split('T')[0] : '',
          sex: response.data.sex,
          jobPreferences: response.data.jobPreferences ? response.data.jobPreferences.join(', ') : '',
          availability: response.data.availability || '',
          workHistory: response.data.workHistory || '',
          jobTypes: response.data.jobTypes ? response.data.jobTypes.join(', ') : '',
          hiringPreferences: response.data.hiringPreferences || '',
          isCompany: response.data.isCompany || false
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        console.error('Error response:', err.response?.data);
        setError('Failed to load profile');
        if (err.response?.status === 401) {
          console.log('Unauthorized - redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async () => {
    setUpdateLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...editForm,
        jobPreferences: editForm.jobPreferences ? editForm.jobPreferences.split(',').map(s => s.trim()) : [],
        jobTypes: editForm.jobTypes ? editForm.jobTypes.split(',').map(s => s.trim()) : [],
      };

      const response = await axios.put('http://localhost:5000/api/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h3>Loading profile...</h3>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h3 style={{ color: 'red' }}>{error}</h3>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <h3>No profile data found</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30, color: '#2d3e50' }}>
        Profile - {user.role === 'worker' ? 'Worker' : 'Employer'}
      </h2>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: 30, 
        borderRadius: 10, 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
      }}>
        {!isEditing ? (
          <>
            {/* Basic Information */}
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: '#2d3e50', borderBottom: '2px solid #3498db', paddingBottom: 10 }}>
                Basic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <strong>Name:</strong> {user.name}
                </div>
                <div>
                  <strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
                <div>
                  <strong>Contact:</strong> {user.contact}
                </div>
                <div>
                  <strong>Date of Birth:</strong> {formatDate(user.dob)}
                </div>
                <div>
                  <strong>Sex:</strong> {user.sex}
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Address:</strong> {user.address}
                </div>
              </div>
            </div>

            {/* Role-specific Information */}
            {user.role === 'worker' && (
              <div style={{ marginBottom: 30 }}>
                <h3 style={{ color: '#2d3e50', borderBottom: '2px solid #3498db', paddingBottom: 10 }}>
                  Worker Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Job Preferences:</strong> 
                    {user.jobPreferences && user.jobPreferences.length > 0 
                      ? user.jobPreferences.join(', ') 
                      : 'Not specified'}
                  </div>
                  <div>
                    <strong>Availability:</strong> {user.availability || 'Not specified'}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Work History:</strong> {user.workHistory || 'Not specified'}
                  </div>
                </div>
              </div>
            )}

            {user.role === 'employer' && (
              <div style={{ marginBottom: 30 }}>
                <h3 style={{ color: '#2d3e50', borderBottom: '2px solid #3498db', paddingBottom: 10 }}>
                  Employer Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Job Types:</strong> 
                    {user.jobTypes && user.jobTypes.length > 0 
                      ? user.jobTypes.join(', ') 
                      : 'Not specified'}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong>Hiring Preferences:</strong> {user.hiringPreferences || 'Not specified'}
                  </div>
                  <div>
                    <strong>Company Account:</strong> {user.isCompany ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '10px 20px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer'
                }}
              >
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Edit Form */}
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ color: '#2d3e50', borderBottom: '2px solid #3498db', paddingBottom: 10 }}>
                Edit Basic Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 5 }}
                    required
                  />
                </div>
                <div>
                  <label>Contact:</label>
                  <input
                    type="text"
                    name="contact"
                    value={editForm.contact}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 5 }}
                    required
                  />
                </div>
                <div>
                  <label>Date of Birth:</label>
                  <input
                    type="date"
                    name="dob"
                    value={editForm.dob}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 5 }}
                    required
                  />
                </div>
                <div>
                  <label>Sex:</label>
                  <select
                    name="sex"
                    value={editForm.sex}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 5 }}
                    required
                  >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label>Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 8, marginTop: 5 }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Role-specific Edit Fields */}
            {user.role === 'worker' && (
              <div style={{ marginBottom: 30 }}>
                <h3 style={{ color: '#2d3e50', borderBottom: '2px solid #3498db', paddingBottom: 10 }}>
                  Edit Worker Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Job Preferences (comma separated):</label>
                    <input
                      type="text"
                      name="jobPreferences"
                      value={editForm.jobPreferences}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 8, marginTop: 5 }}
                      placeholder="e.g., construction, cleaning, delivery"
                    />
                  </div>
                  <div>
                    <label>Availability:</label>
                    <input
                      type="text"
                      name="availability"
                      value={editForm.availability}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 8, marginTop: 5 }}
                      placeholder="e.g., Full-time, Part-time"
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Work History:</label>
                    <textarea
                      name="workHistory"
                      value={editForm.workHistory}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 8, marginTop: 5, minHeight: 80 }}
                      placeholder="Describe your work experience..."
                    />
                  </div>
                </div>
              </div>
            )}

            {user.role === 'employer' && (
              <div style={{ marginBottom: 30 }}>
                <h3 style={{ color: '#2d3e50', borderBottom: '2px solid #3498db', paddingBottom: 10 }}>
                  Edit Employer Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Job Types (comma separated):</label>
                    <input
                      type="text"
                      name="jobTypes"
                      value={editForm.jobTypes}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 8, marginTop: 5 }}
                      placeholder="e.g., construction, cleaning, delivery"
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label>Hiring Preferences:</label>
                    <textarea
                      name="hiringPreferences"
                      value={editForm.hiringPreferences}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 8, marginTop: 5, minHeight: 80 }}
                      placeholder="Describe your hiring preferences..."
                    />
                  </div>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        name="isCompany"
                        checked={editForm.isCompany}
                        onChange={handleEditChange}
                        style={{ marginRight: 8 }}
                      />
                      Is Company Account?
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Action Buttons */}
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              {error && <p style={{ color: 'red', marginBottom: 15 }}>{error}</p>}
              <button 
                onClick={handleUpdate}
                disabled={updateLoading}
                style={{
                  padding: '10px 20px',
                  margin: '0 10px',
                  background: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: updateLoading ? 'not-allowed' : 'pointer',
                  opacity: updateLoading ? 0.7 : 1
                }}
              >
                {updateLoading ? 'Updating...' : 'Save Changes'}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  // Reset form to original values
                  setEditForm({
                    name: user.name,
                    contact: user.contact,
                    address: user.address,
                    dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                    sex: user.sex,
                    jobPreferences: user.jobPreferences ? user.jobPreferences.join(', ') : '',
                    availability: user.availability || '',
                    workHistory: user.workHistory || '',
                    jobTypes: user.jobTypes ? user.jobTypes.join(', ') : '',
                    hiringPreferences: user.hiringPreferences || '',
                    isCompany: user.isCompany || false
                  });
                }}
                style={{
                  padding: '10px 20px',
                  margin: '0 10px',
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 5,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 