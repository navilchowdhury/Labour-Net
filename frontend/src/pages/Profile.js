import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nidNumberInput, setNidNumberInput] = useState('');
  const [nidPhotoFile, setNidPhotoFile] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const navigate = useNavigate();

  // Professional corporate color scheme
  const colors = {
    primary: '#2c5aa0',
    secondary: '#1a202c',
    accent: '#3182ce',
    success: '#38a169',
    warning: '#d69e2e',
    danger: '#e53e3e',
    light: '#f7fafc',
    dark: '#1a202c',
    gray: '#4a5568',
    lightGray: '#e2e8f0',
    white: '#ffffff'
  };

  const jobCategories = ['plumbing', 'cooking', 'painting', 'electrical', 'cleaning'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setForm(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleJobPreferenceChange = (category) => {
    setForm(prev => ({
      ...prev,
      jobPreferences: prev.jobPreferences.includes(category)
        ? prev.jobPreferences.filter(pref => pref !== category)
        : [...prev.jobPreferences, category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Error updating profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <h2 style={{ color: colors.dark }}>Loading your profile...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
          <h2 style={{ color: colors.dark }}>Profile not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, 
          padding: '40px', 
          borderRadius: '12px', 
          marginBottom: '30px',
          color: colors.white,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(44, 90, 160, 0.2)'
        }}>
          <div style={{ 
            width: '80px',
            height: '80px',
            background: colors.white,
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.primary,
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            {user.role === 'worker' ? 'P' : 'E'}
          </div>
          <h1 style={{ 
            margin: '0 0 10px 0', 
            fontSize: '2.5rem', 
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            {user.name}
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: '1.1rem', 
            opacity: 0.9,
            textTransform: 'capitalize'
          }}>
            {user.role} Profile
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div style={{ 
            background: colors.success, 
            color: colors.white, 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {success}
          </div>
        )}
        
        {error && (
          <div style={{ 
            background: colors.danger, 
            color: colors.white, 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        {/* Profile Content */}
        <div style={{ 
          background: colors.white, 
          padding: '30px', 
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid colors.lightGray'
        }}>
          {editing ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: colors.dark }}>
                    👤 Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: colors.dark }}>
                    📞 Contact Number
                  </label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: colors.dark }}>
                    📍 Address
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: colors.dark }}>
                    📅 Date of Birth
                  </label>
                  <input
                    name="dob"
                    type="date"
                    value={form.dob ? new Date(form.dob).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: colors.dark }}>
                    👤 Gender
                  </label>
                  <select
                    name="sex"
                    value={form.sex}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '16px'
                    }}
                  >
                    <option value="male">👨 Male</option>
                    <option value="female">👩 Female</option>
                    <option value="other">🌈 Other</option>
                  </select>
                </div>
              </div>

              {user.role === 'worker' && (
                <>
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', color: colors.dark, fontSize: '18px' }}>
                      🛠️ Job Preferences
                    </label>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                      gap: '15px' 
                    }}>
                      {jobCategories.map(category => (
                        <label key={category} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: 'pointer',
                          padding: '12px',
                          borderRadius: '8px',
                          background: form.jobPreferences?.includes(category) 
                            ? colors.success 
                            : colors.light,
                          color: form.jobPreferences?.includes(category) ? colors.white : colors.dark,
                          border: `2px solid ${form.jobPreferences?.includes(category) ? colors.success : colors.lightGray}`,
                          transition: 'all 0.3s ease',
                          fontWeight: '500'
                        }}>
                          <input 
                            type="checkbox" 
                            checked={form.jobPreferences?.includes(category) || false}
                            onChange={() => handleJobPreferenceChange(category)}
                            style={{ marginRight: '10px' }}
                          />
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: colors.dark }}>
                      ⏰ Availability
                    </label>
                    <input
                      name="availability"
                      value={form.availability || ''}
                      onChange={handleChange}
                      placeholder="e.g., Full-time, Part-time, Weekends"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e2e8f0',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: colors.dark }}>
                      📋 Work History
                    </label>
                    <textarea
                      name="workHistory"
                      value={form.workHistory || ''}
                      onChange={handleChange}
                      placeholder="Describe your work experience..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e2e8f0',
                        fontSize: '16px',
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                </>
              )}

              {user.role === 'employer' && (
                <>
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: colors.dark }}>
                      🏷️ Job Types
                    </label>
                    <input
                      name="jobTypes"
                      value={Array.isArray(form.jobTypes) ? form.jobTypes.join(', ') : (form.jobTypes || '')}
                      onChange={handleChange}
                      placeholder="e.g., plumbing, electrical, cleaning"
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e2e8f0',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: colors.dark }}>
                      👥 Hiring Preferences
                    </label>
                    <textarea
                      name="hiringPreferences"
                      value={form.hiringPreferences || ''}
                      onChange={handleChange}
                      placeholder="Describe your hiring preferences..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid #e2e8f0',
                        fontSize: '16px',
                        minHeight: '100px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      padding: '12px',
                      borderRadius: '8px',
                      background: form.isCompany ? colors.success : colors.light,
                      color: form.isCompany ? colors.white : colors.dark,
                      border: `2px solid ${form.isCompany ? colors.success : colors.lightGray}`,
                      transition: 'all 0.3s ease'
                    }}>
                      <input 
                        type="checkbox" 
                        name="isCompany" 
                        checked={form.isCompany || false} 
                        onChange={handleChange}
                        style={{ marginRight: '12px' }}
                      />
                      Is Company?
                    </label>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    background: colors.lightGray,
                    color: colors.gray,
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: colors.primary,
                    color: colors.white,
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                <div style={{ 
                  background: colors.light, 
                  padding: '20px', 
                  borderRadius: '8px',
                  border: '1px solid colors.lightGray'
                }}>
                  <h3 style={{ margin: '0 0 10px 0', color: colors.primary, fontSize: '18px' }}>Personal Information</h3>
                  <p style={{ margin: '5px 0', color: colors.dark }}><strong>Name:</strong> {user.name}</p>
                  <p style={{ margin: '5px 0', color: colors.dark }}><strong>Contact:</strong> {user.contact}</p>
                  <p style={{ margin: '5px 0', color: colors.dark }}><strong>Address:</strong> {user.address}</p>
                  <p style={{ margin: '5px 0', color: colors.dark }}><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString()}</p>
                  <p style={{ margin: '5px 0', color: colors.dark }}><strong>Gender:</strong> {user.sex}</p>
                </div>

                {user.role === 'worker' && (
                  <div style={{ 
                    background: colors.light, 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid colors.lightGray'
                  }}>
                    <h3 style={{ margin: '0 0 10px 0', color: colors.primary, fontSize: '18px' }}>Professional Details</h3>
                    <p style={{ margin: '5px 0', color: colors.dark }}>
                      <strong>Job Preferences:</strong> {user.jobPreferences?.length > 0 ? user.jobPreferences.join(', ') : 'None selected'}
                    </p>
                    <p style={{ margin: '5px 0', color: colors.dark }}>
                      <strong>Availability:</strong> {user.availability || 'Not specified'}
                    </p>
                    <p style={{ margin: '5px 0', color: colors.dark }}>
                      <strong>Work History:</strong> {user.workHistory || 'Not specified'}
                    </p>
                  </div>
                )}

                {user.role === 'employer' && (
                  <div style={{ 
                    background: colors.light, 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid colors.lightGray'
                  }}>
                    <h3 style={{ margin: '0 0 10px 0', color: colors.primary, fontSize: '18px' }}>Organization Details</h3>
                    <p style={{ margin: '5px 0', color: colors.dark }}>
                      <strong>Job Types:</strong> {Array.isArray(user.jobTypes) && user.jobTypes.length > 0 ? user.jobTypes.join(', ') : 'Not specified'}
                    </p>
                    <p style={{ margin: '5px 0', color: colors.dark }}>
                      <strong>Hiring Preferences:</strong> {user.hiringPreferences || 'Not specified'}
                    </p>
                    <p style={{ margin: '5px 0', color: colors.dark }}>
                      <strong>Company:</strong> {user.isCompany ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}
              </div>
              
              <div style={{ 
                marginTop: '20px',
                textAlign: 'center'
              }}>
                <h3 style={{ 
                  marginBottom: '10px',
                  color: user.isNidVerified ? colors.success : colors.danger,
                  fontSize: '1.2rem'
                }}>
                  {user.isNidVerified ? 'Verified' : 'Unverified'}
                </h3>
                {!user.isNidVerified && (
                  <div style={{ 
                    backgroundColor: colors.warning,
                    padding: '15px',
                    borderRadius: '8px',
                    color: colors.dark
                  }}>
                    <p>
                      <strong>Verification Failed:</strong> Your NID information does not match. 
                      Please ensure the name and number on your NID match your profile exactly.
                    </p>
                    <div style={{ marginTop: '15px', textAlign: 'left' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>NID Number</label>
                      <input
                        type="text"
                        value={nidNumberInput}
                        onChange={(e) => setNidNumberInput(e.target.value)}
                        placeholder="Enter NID Number"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <label style={{ display: 'block', margin: '12px 0 8px', fontWeight: '600' }}>Upload NID Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setNidPhotoFile(e.target.files?.[0] || null)}
                        style={{ width: '100%' }}
                      />
                      <button
                        disabled={verifyLoading}
                        onClick={async () => {
                          try {
                            setVerifyLoading(true);
                            const token = localStorage.getItem('token');
                            const formData = new FormData();
                            formData.append('name', user.name);
                            formData.append('nidNumber', nidNumberInput);
                            if (nidPhotoFile) formData.append('nidPhoto', nidPhotoFile);
                            const res = await axios.post('http://localhost:5000/api/nid/verify-and-update', formData, {
                              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                            });
                            if (res.data?.isVerified) {
                              setSuccess('NID verified successfully!');
                              fetchProfile();
                            } else {
                              setError('NID verification failed. Please try again.');
                            }
                          } catch (e) {
                            setError('Verification request failed');
                          } finally {
                            setVerifyLoading(false);
                            setTimeout(() => { setError(''); setSuccess(''); }, 3000);
                          }
                        }}
                        style={{
                          marginTop: '12px',
                          background: colors.success,
                          color: colors.white,
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {verifyLoading ? 'Verifying...' : 'Verify Now'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    background: colors.primary,
                    color: colors.white,
                    border: 'none',
                    padding: '15px 40px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '16px',
                    boxShadow: '0 4px 15px rgba(44, 90, 160, 0.2)'
                  }}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
