import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ShiftScheduling.css';

const ShiftScheduling = () => {
  const [shifts, setShifts] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [shiftForm, setShiftForm] = useState({
    startTime: '',
    endTime: '',
    jobTitle: '',
    address: '',
    description: '',
    contactPerson: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/shifts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShifts(response.data);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddShift = (day) => {
    setSelectedDay(day);
    setShiftForm({
      startTime: '',
      endTime: '',
      jobTitle: '',
      address: '',
      description: '',
      contactPerson: '',
      phone: ''
    });
  };

  const handleSaveShift = async () => {
    if (!selectedDay || !shiftForm.startTime || !shiftForm.endTime || !shiftForm.jobTitle) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const shiftData = {
        day: selectedDay,
        ...shiftForm
      };

      await axios.post('http://localhost:5000/api/shifts', shiftData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchShifts();
      setSelectedDay(null);
      alert('Shift added successfully!');
    } catch (error) {
      console.error('Error saving shift:', error);
      alert('Failed to save shift. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteShift = async (day, shiftId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Are you sure you want to delete this shift?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/shifts/${shiftId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchShifts();
    } catch (error) {
      console.error('Error deleting shift:', error);
      alert('Failed to delete shift. Please try again.');
    }
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="shift-scheduling">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="shift-scheduling">
      <div className="shift-header">
        <h1>📅 My Work Schedule</h1>
        <p>Manage your weekly work routine and keep track of your shifts</p>
      </div>

      <div className="weekly-schedule">
        {daysOfWeek.map(day => (
          <div key={day} className="day-card">
            <div className="day-header">
              <h3>{day}</h3>
              <button 
                onClick={() => handleAddShift(day)}
                className="add-shift-btn"
                title="Add shift"
              >
                +
              </button>
            </div>
            
            <div className="shifts-container">
              {shifts[day] && shifts[day].length > 0 ? (
                shifts[day].map((shift, index) => (
                  <div key={index} className="shift-card">
                    <div className="shift-time">
                      <span className="time-badge">
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                      </span>
                    </div>
                    <div className="shift-details">
                      <h4>{shift.jobTitle}</h4>
                      <p className="shift-address">📍 {shift.address}</p>
                      {shift.description && (
                        <p className="shift-description">{shift.description}</p>
                      )}
                      {shift.contactPerson && (
                        <div className="shift-contact">
                          <p>👤 {shift.contactPerson}</p>
                          {shift.phone && <p>📞 {shift.phone}</p>}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDeleteShift(day, shift._id)}
                      className="delete-shift-btn"
                      title="Delete shift"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-shifts">
                  <p>No shifts scheduled</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Shift Form Modal */}
      {selectedDay && (
        <div className="modal-overlay">
          <div className="shift-modal">
            <div className="modal-header">
              <h2>Add Shift for {selectedDay}</h2>
              <button 
                onClick={() => setSelectedDay(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={shiftForm.jobTitle}
                  onChange={(e) => setShiftForm({...shiftForm, jobTitle: e.target.value})}
                  placeholder="e.g., Plumbing Work, House Cleaning"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    value={shiftForm.startTime}
                    onChange={(e) => setShiftForm({...shiftForm, startTime: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="time"
                    value={shiftForm.endTime}
                    onChange={(e) => setShiftForm({...shiftForm, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={shiftForm.address}
                  onChange={(e) => setShiftForm({...shiftForm, address: e.target.value})}
                  placeholder="Work location address"
                />
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  value={shiftForm.description}
                  onChange={(e) => setShiftForm({...shiftForm, description: e.target.value})}
                  placeholder="Brief description of the work to be done"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    value={shiftForm.contactPerson}
                    onChange={(e) => setShiftForm({...shiftForm, contactPerson: e.target.value})}
                    placeholder="Client or supervisor name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={shiftForm.phone}
                    onChange={(e) => setShiftForm({...shiftForm, phone: e.target.value})}
                    placeholder="Contact phone number"
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setSelectedDay(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveShift}
                className="save-btn"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Shift'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftScheduling;
