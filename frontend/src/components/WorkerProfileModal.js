import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WorkerProfileModal({ workerId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/applications/worker/${workerId}/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (mounted) {
          setProfile(data);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [workerId, token]);

  if (!workerId) return null;

  return (
    <div style={overlayStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>Worker Profile</h2>
          <button onClick={onClose} style={closeBtnStyle} aria-label="Close">×</button>
        </div>

        {loading && <p>Loading…</p>}

        {!loading && profile && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <section style={sectionStyle}>
              <h3 style={h3Style}>Basic Info</h3>
              <div><b>Name:</b> {profile.worker?.name || '—'}</div>
              <div><b>Contact:</b> {profile.worker?.contact || '—'}</div>
              <div><b>NID Verified:</b> {profile.worker?.nidVerified ? '✅ Verified' : '❌ Not Verified'}</div>
              <div><b>Preferences:</b> {Array.isArray(profile.worker?.jobPreferences) ? profile.worker.jobPreferences.join(', ') : '—'}</div>
              <div><b>Availability:</b> {profile.worker?.availability || '—'}</div>
              <div><b>Member Since:</b> {profile.worker?.createdAt ? new Date(profile.worker.createdAt).toLocaleDateString() : '—'}</div>
              {Array.isArray(profile.worker?.workHistory) && profile.worker.workHistory.length > 0 && (
                <div><b>Work History (Profile Notes):</b>
                  <ul style={{ marginTop: 6 }}>
                    {profile.worker.workHistory.map((w, idx) => <li key={idx}>{String(w)}</li>)}
                  </ul>
                </div>
              )}
            </section>

            <section style={sectionStyle}>
              <h3 style={h3Style}>Assigned / Completed Jobs</h3>
              {Array.isArray(profile.history) && profile.history.length > 0 ? (
                profile.history.map(app => (
                  <div key={app._id} style={cardStyle}>
                    <div><b>Category:</b> {app.job?.category || '—'}</div>
                    <div><b>Status:</b> {app.status}</div>
                    <div><b>Salary Range:</b> {app.job?.salaryRange || '—'}</div>
                    <div><b>Working Hours:</b> {app.job?.workingHours || '—'}</div>
                    <div><b>Address:</b> {app.job?.address || '—'}</div>
                    <div><b>Employer:</b> {app.job?.employer?.name || '—'} {app.job?.employer?.contact ? `(${app.job.employer.contact})` : ''}</div>
                    {app.message && <div><b>Application Note:</b> {app.message}</div>}
                    <div style={{ fontSize: 12, color: '#666' }}>
                      Applied: {app.createdAt ? new Date(app.createdAt).toLocaleString() : '—'}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#666' }}>No assigned/completed jobs yet.</div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 9999
};
const modalStyle = {
  width: 'min(720px, 95vw)', background: '#fff', borderRadius: 12, padding: 16,
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
};
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 };
const closeBtnStyle = { border: 'none', background: 'transparent', fontSize: 24, cursor: 'pointer', lineHeight: 1 };
const sectionStyle = { marginTop: 12, paddingTop: 8, borderTop: '1px solid #eee' };
const h3Style = { margin: '0 0 8px 0' };
const cardStyle = { border: '1px solid #eee', borderRadius: 8, padding: 10, marginBottom: 8, background: '#fafafa' };
