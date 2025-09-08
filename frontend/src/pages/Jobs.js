import React from 'react';
import JobList from '../components/Joblist';
import JobPostForm from '../components/JobPostForm';
import WorkerSearchPanel from '../components/WorkerSearchPanel';
import EmployerJobsView from '../components/EmployerJobsView';
import '../styles/professional.css';
import '../styles/EmployerJobsView.css';

export default function Jobs() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <div>
      {token && role === 'employer' ? (
        <div>
          <div style={{ marginTop: 30 }}>
            <JobPostForm token={token} />
          </div>
          <div style={{ marginTop: 30 }}>
            <EmployerJobsView />
          </div>
          <div style={{ marginTop: 30 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Find Workers</h2>
            <WorkerSearchPanel />
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          <JobList />
        </div>
      )}
    </div>
  );
}