import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Jobs.css';

function Jobs({ token }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    minSalary: '',
    hasEquity: false,
  });
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  // Fetch jobs from the backend
  useEffect(() => {
    async function fetchJobs() {
      try {
        const query = new URLSearchParams();

        if (filters.title) query.append('title', filters.title);
        if (filters.minSalary) query.append('minSalary', filters.minSalary);
        if (filters.hasEquity) query.append('hasEquity', filters.hasEquity);

        const response = await axios.get(
          `http://localhost:3001/jobs?${query.toString()}`
        );
        setJobs(response.data.jobs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    }

    fetchJobs();
  }, [filters]);

  // Handle filter changes
  function handleFilterChange(evt) {
    const { name, value, type, checked } = evt.target;
    setFilters((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }
  async function handleApply(jobId) {
    try {
      // Call the apply endpoint
      await axios.post(
        `http://localhost:3001/jobs/${jobId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the applied jobs state
      setAppliedJobs(new Set(appliedJobs).add(jobId));
    } catch (err) {
      console.error('Error applying for job:', err);
    }
  }
  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="jobs-container">
      <h1>Jobs</h1>

      {/* Filters Section */}
      <div className="filters">
        <input
          type="text"
          name="title"
          placeholder="Filter by title"
          value={filters.title}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minSalary"
          placeholder="Minimum Salary"
          value={filters.minSalary}
          onChange={handleFilterChange}
        />
        <label>
          <input
            type="checkbox"
            name="hasEquity"
            checked={filters.hasEquity}
            onChange={handleFilterChange}
          />
          Has Equity
        </label>
      </div>

      {/* Jobs List */}
      <div className="jobs-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h2>{job.title}</h2>
            <p>
              Salary: {job.salary ? `$${job.salary.toLocaleString()}` : 'N/A'}
            </p>
            <p>Equity: {job.equity ? job.equity : 'N/A'}</p>
            <p>Company: {job.companyHandle}</p>
            {appliedJobs.has(job.id) ? (
              <button className="applied-button" disabled>
                Applied
              </button>
            ) : (
              <button
                className="apply-button"
                onClick={() => handleApply(job.id)}>
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
