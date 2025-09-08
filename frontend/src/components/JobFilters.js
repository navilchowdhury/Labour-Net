import React from 'react';
import '../styles/JobFilters.css';

const JobFilters = ({ filters, onFilterChange, userRole }) => {
  const jobCategories = ['All', 'Plumbing', 'Cooking', 'Painting', 'Electrical', 'Cleaning'];
  const salaryRanges = ['All', '5000-10000', '10000-15000', '15000-20000', '20000+'];

  return (
    <div className="job-filters">
      <h3>Filter Jobs</h3>
      
      <div className="filter-group">
        <label>Job Category</label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => onFilterChange('category', e.target.value === 'All' ? '' : e.target.value)}
        >
          {jobCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Salary Range</label>
        <select
          value={filters.salary || 'All'}
          onChange={(e) => onFilterChange('salary', e.target.value === 'All' ? '' : e.target.value)}
        >
          {salaryRanges.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Location</label>
        <input
          type="text"
          placeholder="Enter location..."
          value={filters.location || ''}
          onChange={(e) => onFilterChange('location', e.target.value)}
        />
      </div>

      {userRole === 'worker' && (
        <>
          <div className="filter-group">
            <label>Minimum Salary</label>
            <input
              type="number"
              placeholder="Min salary..."
              value={filters.minSalary || ''}
              onChange={(e) => onFilterChange('minSalary', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Maximum Salary</label>
            <input
              type="number"
              placeholder="Max salary..."
              value={filters.maxSalary || ''}
              onChange={(e) => onFilterChange('maxSalary', e.target.value)}
            />
          </div>
        </>
      )}

      <button 
        onClick={() => onFilterChange('reset')}
        className="reset-filters-btn"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default JobFilters;
