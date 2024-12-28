import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JoblyApi from '../api';
import './JobDetail.css';

function JobDetail() {
  const { id } = useParams(); // Get job ID from URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        console.log('JoblyApi object:', JoblyApi); // Debugging log
        const jobData = await JoblyApi.getJob(id); // Add a method in JoblyApi to fetch a single job by ID
        setJob(jobData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job details:', err);
      }
    }

    fetchJob();
  }, [id]);

  if (loading) return <p>Loading job details...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="job-detail">
      <h1>{job.title}</h1>
      <p>
        <strong>Salary:</strong>{' '}
        {job.salary ? `$${job.salary}` : 'No salary info'}
      </p>
      <p>
        <strong>Equity:</strong> {job.equity ? job.equity : 'No equity info'}
      </p>
      <p>
        <strong>Company:</strong> {job.companyName}
      </p>
    </div>
  );
}

export default JobDetail;
