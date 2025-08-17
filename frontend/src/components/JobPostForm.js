import React, { useState } from 'react';
import axios from 'axios';

export default function JobPostForm({ token }) {
  const [form, setForm] = useState({
    category: '', workingHours: '', salaryRange: '', address: '', description: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', form, {
        headers: { Authorization: token }
      });
      setMessage('Job posted successfully!');
      setForm({ category: '', workingHours: '', salaryRange: '', address: '', description: '' });
    } catch {
      setMessage('Failed to post job.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto', background: '#f4f6fa', padding: 24, borderRadius: 8 }}>
      <h3>Post a Job</h3>
      <div style={{ marginBottom: 12 }}>
        <select name="category" value={form.category} onChange={handleChange} required style={{ width: '100%', padding: 8 }}>
          <option value="">Select Category</option>
          <option value="plumbing">Plumbing</option>
          <option value="cleaning">Cleaning</option>
          <option value="electrical">Electrical</option>
          <option value="cooking">Cooking</option>
          <option value="painting">Painting</option>
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <input name="workingHours" value={form.workingHours} onChange={handleChange} placeholder="Working Hours" required style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <input name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="Salary Range" required style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Working Address" required style={{ width: '100%', padding: 8 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Job Description" style={{ width: '100%', padding: 8 }} />
      </div>
      <button type="submit" style={{ width: '100%', padding: 10, background: '#2d3e50', color: '#fff', border: 'none', borderRadius: 4 }}>
        Post Job
      </button>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </form>
  );
}