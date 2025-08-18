import React, { useState } from 'react';

export default function AuthForm({ type, onSubmit }) {
  const [role, setRole] = useState('worker');
  const [form, setForm] = useState({
    name: '', contact: '', address: '', dob: '', sex: '',
    password: '', jobPreferences: [], availability: '', workHistory: '',
    jobTypes: '', hiringPreferences: '', isCompany: false
  });

  const jobCategories = ['plumbing', 'cooking', 'painting', 'electrical', 'cleaning'];

  const handleChange = e => {
    const { name, value, type: inputType, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
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

  const handleRoleChange = e => {
    setRole(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ ...form, role });
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      maxWidth: 500, 
      margin: 'auto', 
      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', 
      padding: '30px', 
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      {type === 'register' && (
        <>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2d3748', fontSize: '1.5rem' }}>
              Choose Your Role
            </h3>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '10px 20px',
                borderRadius: '15px',
                background: role === 'worker' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
                color: role === 'worker' ? 'white' : '#4a5568',
                transition: 'all 0.3s ease'
              }}>
                <input 
                  type="radio" 
                  value="worker" 
                  checked={role === 'worker'} 
                  onChange={handleRoleChange}
                  style={{ marginRight: '8px' }}
                />
                Worker
              </label>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '10px 20px',
                borderRadius: '15px',
                background: role === 'employer' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
                color: role === 'employer' ? 'white' : '#4a5568',
                transition: 'all 0.3s ease'
              }}>
                <input 
                  type="radio" 
                  value="employer" 
                  checked={role === 'employer'} 
                  onChange={handleRoleChange}
                  style={{ marginRight: '8px' }}
                />
                Employer
              </label>
            </div>
          </div>
        </>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Full Name" 
          required 
          style={{ 
            width: '100%', 
            padding: '15px', 
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#667eea';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      
      {type === 'register' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <input 
              name="contact" 
              value={form.contact} 
              onChange={handleChange} 
              placeholder="Contact Number" 
              required 
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input 
              name="address" 
              value={form.address} 
              onChange={handleChange} 
              placeholder="Address" 
              required 
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input 
              name="dob" 
              type="date" 
              value={form.dob} 
              onChange={handleChange} 
              placeholder="Date of Birth" 
              required 
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <select 
              name="sex" 
              value={form.sex} 
              onChange={handleChange} 
              required 
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                fontSize: '16px',
                transition: 'all 0.3s ease',
                background: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {role === 'worker' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  color: '#2d3748',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  Select Your Job Preferences:
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '10px' 
                }}>
                  {jobCategories.map(category => (
                    <label key={category} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      padding: '10px',
                      borderRadius: '10px',
                      background: form.jobPreferences.includes(category) 
                        ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' 
                        : '#f7fafc',
                      color: form.jobPreferences.includes(category) ? 'white' : '#4a5568',
                      border: `2px solid ${form.jobPreferences.includes(category) ? '#38f9d7' : '#e2e8f0'}`,
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={form.jobPreferences.includes(category)}
                        onChange={() => handleJobPreferenceChange(category)}
                        style={{ marginRight: '8px' }}
                      />
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  name="availability" 
                  value={form.availability} 
                  onChange={handleChange} 
                  placeholder="Availability (e.g., Full-time, Part-time, Weekends)" 
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <textarea 
                  name="workHistory" 
                  value={form.workHistory} 
                  onChange={handleChange} 
                  placeholder="Work History & Experience (optional)" 
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </>
          )}
          
          {role === 'employer' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <input 
                  name="jobTypes" 
                  value={form.jobTypes} 
                  onChange={handleChange} 
                  placeholder="Job Types (comma separated)" 
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <textarea 
                  name="hiringPreferences" 
                  value={form.hiringPreferences} 
                  onChange={handleChange} 
                  placeholder="Hiring Preferences & Requirements" 
                  style={{ 
                    width: '100%', 
                    padding: '15px', 
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '10px',
                  borderRadius: '10px',
                  background: form.isCompany ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : '#f7fafc',
                  color: form.isCompany ? 'white' : '#4a5568',
                  border: `2px solid ${form.isCompany ? '#38f9d7' : '#e2e8f0'}`,
                  transition: 'all 0.3s ease'
                }}>
                  <input 
                    type="checkbox" 
                    name="isCompany" 
                    checked={form.isCompany} 
                    onChange={handleChange}
                    style={{ marginRight: '10px' }}
                  />
                  Is Company?
                </label>
              </div>
            </>
          )}
        </>
      )}
      
      <div style={{ marginBottom: '25px' }}>
        <input 
          name="password" 
          type="password" 
          value={form.password} 
          onChange={handleChange} 
          placeholder="Password" 
          required 
          style={{ 
            width: '100%', 
            padding: '15px', 
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#667eea';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      
      <button 
        type="submit" 
        style={{ 
          width: '100%', 
          padding: '15px', 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          border: 'none', 
          borderRadius: '15px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
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
        {type === 'register' ? 'Create Account' : 'Sign In'}
      </button>
    </form>
  );
}