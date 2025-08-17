import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    let url = 'http://localhost:5000/api/jobs';
    const params = [];
    if (category) params.push(`category=${category}`);
    if (salary) params.push(`salary=${salary}`);
    if (params.length) url += '?' + params.join('&');
    axios.get(url)
      .then(res => setJobs(res.data))
      .catch(() => setJobs([]));
  }, [category, salary]);

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 24 }}>
      <h2>Job Listings</h2>
      <div style={{ marginBottom: 16 }}>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginRight: 8 }}>
          <option value="">All Categories</option>
          <option value="plumbing">Plumbing</option>
          <option value="cleaning">Cleaning</option>
          <option value="electrical">Electrical</option>
          <option value="cooking">Cooking</option>
          <option value="painting">Painting</option>
        </select>
        <input placeholder="Salary Range" value={salary} onChange={e => setSalary(e.target.value)} />
      </div>
      <div>
        {jobs.length === 0 && <p>No jobs found.</p>}
        {jobs.map(job => (
          <div key={job._id} style={{ background: '#fff', marginBottom: 16, padding: 16, borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
            <h3>{job.category}</h3>
            <p><b>Employer:</b> {job.employer?.name}</p>
            <p><b>Contact:</b> {job.employer?.contact || 'Contact not available'}</p>
            <p><b>Working Hours:</b> {job.workingHours}</p>
            <p><b>Salary:</b> {job.salaryRange}</p>
            <p><b>Address:</b> {job.address}</p>
            <p><b>Description:</b> {job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}