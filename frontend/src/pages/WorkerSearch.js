import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WorkerCard from '../components/WorkerCard';
import WorkerProfileModal from '../components/WorkerProfileModal';
import '../styles/professional.css';

export default function WorkerSearch() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Search filters
  const [filters, setFilters] = useState({
    address: '',
    jobCategory: '',
    availability: '',
    rating: '',
    verifiedOnly: false
  });

  const jobCategories = ['plumbing', 'cooking', 'painting', 'electrical', 'cleaning'];
  const availabilityOptions = ['full-time', 'part-time', 'weekends', 'evenings', 'flexible'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'employer') {
      navigate('/login');
      return;
    }

    fetchWorkers();
  }, [navigate]);

  useEffect(() => {
    applyFilters();
  }, [workers, filters]);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/search-workers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWorkers(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching workers:', err);
      setError('Failed to load workers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...workers];

    // Address filter
    if (filters.address.trim()) {
      filtered = filtered.filter(worker => 
        worker.address?.toLowerCase().includes(filters.address.toLowerCase()) ||
        worker.location?.toLowerCase().includes(filters.address.toLowerCase())
      );
    }

    // Job category filter
    if (filters.jobCategory) {
      filtered = filtered.filter(worker => 
        worker.jobPreferences?.includes(filters.jobCategory)
      );
    }

    // Availability filter
    if (filters.availability) {
      filtered = filtered.filter(worker => 
        worker.availability?.toLowerCase().includes(filters.availability.toLowerCase())
      );
    }

    // Rating filter (if workers have ratings)
    if (filters.rating) {
      filtered = filtered.filter(worker => {
        // This would need to be enhanced when ratings are implemented
        return true; // For now, show all workers
      });
    }

    // Verified only filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter(worker => worker.isNidVerified);
    }

    setFilteredWorkers(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      address: '',
      jobCategory: '',
      availability: '',
      rating: '',
      verifiedOnly: false
    });
  };

  const handleWorkerSelect = async (workerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/auth/worker/${workerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSelectedWorker(response.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching worker profile:', err);
      setError('Failed to load worker details');
    }
  };

  if (loading) {
    return (
      <div className="professional-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h2>Loading Workers...</h2>
          <p>Please wait while we fetch available workers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="professional-container">
      {/* Page Header */}
      <div className="professional-page-header">
        <h1 className="professional-page-title">🔍 Find Workers</h1>
        <p className="professional-page-subtitle">
          Discover skilled workers in your area and connect with the best talent
        </p>
      </div>

      {/* Search Filters */}
      <div className="professional-card mb-4">
        <div className="professional-card-header">
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>
            🔎 Search Filters
          </h3>
        </div>
        <div className="professional-card-body">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {/* Address Filter */}
            <div className="professional-form-group">
              <label className="professional-form-label">
                📍 Location/Address
              </label>
              <input
                type="text"
                className="professional-form-input"
                placeholder="Enter location or address"
                value={filters.address}
                onChange={(e) => handleFilterChange('address', e.target.value)}
              />
            </div>

            {/* Job Category Filter */}
            <div className="professional-form-group">
              <label className="professional-form-label">
                🛠️ Job Category
              </label>
              <select
                className="professional-form-input"
                value={filters.jobCategory}
                onChange={(e) => handleFilterChange('jobCategory', e.target.value)}
              >
                <option value="">All Categories</option>
                {jobCategories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div className="professional-form-group">
              <label className="professional-form-label">
                ⏰ Availability
              </label>
              <select
                className="professional-form-input"
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
              >
                <option value="">All Availability</option>
                {availabilityOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified Only Filter */}
            <div className="professional-form-group">
              <label className="professional-form-label">
                ✅ Verification Status
              </label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.75rem',
                background: 'var(--background-color)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <input
                  type="checkbox"
                  id="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                  style={{ margin: 0 }}
                />
                <label htmlFor="verifiedOnly" style={{ margin: 0, cursor: 'pointer' }}>
                  Show verified workers only
                </label>
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={clearFilters}
              className="professional-btn professional-btn-secondary"
            >
              🗑️ Clear Filters
            </button>
            <button
              onClick={applyFilters}
              className="professional-btn professional-btn-primary"
            >
              🔍 Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ 
        marginBottom: '1.5rem',
        padding: '1rem',
        background: 'var(--surface-color)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
          Found {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''}
          {workers.length !== filteredWorkers.length && (
            <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>
              {' '}out of {workers.length} total
            </span>
          )}
        </h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="professional-alert professional-alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Workers Grid */}
      {filteredWorkers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👷‍♂️</div>
          <h3 className="empty-state-title">No Workers Found</h3>
          <p className="empty-state-description">
            {workers.length === 0 
              ? "No workers are currently available. Please try again later."
              : "No workers match your current filters. Try adjusting your search criteria."
            }
          </p>
          {workers.length > 0 && (
            <button
              onClick={clearFilters}
              className="professional-btn professional-btn-primary"
            >
              🔄 Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredWorkers.map(worker => (
            <WorkerCard
              key={worker._id}
              worker={worker}
              onSelect={() => handleWorkerSelect(worker._id)}
            />
          ))}
        </div>
      )}

      {/* Worker Profile Modal */}
      {showModal && selectedWorker && (
        <WorkerProfileModal
          worker={selectedWorker}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedWorker(null);
          }}
          onRefresh={(updatedWorker) => {
            setSelectedWorker(updatedWorker);
          }}
        />
      )}
    </div>
  );
}