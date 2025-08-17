import React, { useState } from 'react';

export default function AuthForm({ type, onSubmit }) {
  const [role, setRole] = useState('worker');
  const [form, setForm] = useState({
    name: '', contact: '', address: '', dob: '', sex: '',
    password: '', jobPreferences: '', availability: '', workHistory: '',
    jobTypes: '', hiringPreferences: '', isCompany: false
  });

  const handleChange = e => {
    const { name, value, type: inputType, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value
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
                <input name="jobPreferences" value={form.jobPreferences} onChange={handleChange} placeholder="Job Preferences (comma separated)" style={{ width: '100%', padding: 8 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input name="availability" value={form.availability} onChange={handleChange} placeholder="Availability" style={{ width: '100%', padding: 8 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input name="workHistory" value={form.workHistory} onChange={handleChange} placeholder="Work History" style={{ width: '100%', padding: 8 }} />
              </div>
            </>
          )}
          {role === 'employer' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <input name="jobTypes" value={form.jobTypes} onChange={handleChange} placeholder="Job Types (comma separated)" style={{ width: '100%', padding: 8 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <input name="hiringPreferences" value={form.hiringPreferences} onChange={handleChange} placeholder="Hiring Preferences" style={{ width: '100%', padding: 8 }} />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label>
                  <input type="checkbox" name="isCompany" checked={form.isCompany} onChange={handleChange} /> Is Company?
                </label>
              </div>
            </>
          )}
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