import React, { useState } from 'react';

export default function AuthForm({ type, onSubmit }) {
  const [role, setRole] = useState('worker');
  const [form, setForm] = useState({
    name: '', contact: '', address: '', dob: '', sex: '',
    password: '', jobPreferences: [], availability: '', workHistory: '',
    jobTypes: '', hiringPreferences: '', isCompany: false,
    nidNumber: '', nidPhoto: null
  });

  const jobCategories = ['plumbing', 'cooking', 'painting', 'electrical', 'cleaning'];
  const availabilityOptions = [
    'full-time',
    'part-time', 
    'weekends',
    'evenings',
    'flexible',
    'monday-friday',
    'saturday-sunday'
  ];

  const handleChange = e => {
    const { name, value, type: inputType, checked, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : (inputType === 'file' ? files[0] : value)
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
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', background: '#f4f6fa', padding: 24, borderRadius: 8 }}>
      {type === 'register' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <label>
              <input type="radio" value="worker" checked={role === 'worker'} onChange={handleRoleChange} /> Worker
            </label>
            <label style={{ marginLeft: 16 }}>
              <input type="radio" value="employer" checked={role === 'employer'} onChange={handleRoleChange} /> Employer
            </label>
          </div>
        </>
      )}
      <div style={{ marginBottom: 12 }}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required style={{ width: '100%', padding: 8 }} />
      </div>
      {type === 'register' && (
        <>
          <div style={{ marginBottom: 12 }}>
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact Number" required style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" required style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <input name="dob" type="date" value={form.dob} onChange={handleChange} placeholder="Date of Birth" required style={{ width: '100%', padding: 8 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <select name="sex" value={form.sex} onChange={handleChange} required style={{ width: '100%', padding: 8 }}>
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {role === 'worker' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '600' }}>
                  Job Preferences (Select all that apply):
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '8px',
                  border: '1px solid #ddd',
                  padding: '12px',
                  borderRadius: '4px',
                  background: '#fff'
                }}>
                  {jobCategories.map(category => (
                    <label key={category} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '4px',
                      background: form.jobPreferences.includes(category) ? '#e3f2fd' : 'transparent',
                      border: `1px solid ${form.jobPreferences.includes(category) ? '#2196f3' : '#ddd'}`,
                      transition: 'all 0.2s ease'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={form.jobPreferences.includes(category)}
                        onChange={() => handleJobPreferenceChange(category)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ 
                        textTransform: 'capitalize',
                        fontSize: '14px',
                        fontWeight: form.jobPreferences.includes(category) ? '600' : '400'
                      }}>
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '600' }}>
                  Availability:
                </label>
                <select name="availability" value={form.availability} onChange={handleChange} required style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Select Availability</option>
                  {availabilityOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '600' }}>
                  Work History:
                </label>
                <textarea 
                  name="workHistory" 
                  value={form.workHistory} 
                  onChange={handleChange} 
                  placeholder="Describe your work experience and skills..." 
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }} 
                />
              </div>
            </>
          )}
          {role === 'employer' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <label>
                  <input type="checkbox" name="isCompany" checked={form.isCompany} onChange={handleChange} /> Is Company?
                </label>
              </div>
            </>
          )}
          {/* Optional NID Verification */}
          <div style={{ marginTop: 16, padding: 12, background: '#eef3ff', borderRadius: 6 }}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>Optional NID Verification</div>
            <div style={{ marginBottom: 12 }}>
              <input name="nidNumber" value={form.nidNumber} onChange={handleChange} placeholder="NID Number (10-17 digits)" style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <input name="nidPhoto" type="file" accept="image/*" onChange={handleChange} style={{ width: '100%', padding: 8 }} />
            </div>
          </div>
        </>
      )}
      <div style={{ marginBottom: 12 }}>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" required style={{ width: '100%', padding: 8 }} />
      </div>
      <button type="submit" style={{ width: '100%', padding: 10, background: '#2d3e50', color: '#fff', border: 'none', borderRadius: 4 }}>
        {type === 'register' ? 'Register' : 'Login'}
      </button>
    </form>
  );
}