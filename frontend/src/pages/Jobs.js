import React from 'react';
import JobList from '../components/Joblist';
import JobPostForm from '../components/JobPostForm';

export default function Jobs() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <div>
      {token && role === 'employer' && (
        <div style={{ marginTop: 30 }}>
          <JobPostForm token={token} />
        </div>
      )}
      <div style={{ marginTop: 30 }}>
        <JobList />
      </div>
    </div>
  );
}