import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import JoblyApi from '../api';
import './CompanyDetail.css';

function CompanyDetail() {
  const { handle } = useParams(); // Get company handle from URL
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const companyData = await JoblyApi.getCompany(handle);
        setCompany(companyData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching company details:', err);
      }
    }

    fetchCompany();
  }, [handle]);

  if (loading) return <p>Loading company details...</p>;
  if (!company) return <p>Company not found.</p>;

  return (
    <div className="company-detail">
      <h1>{company.name}</h1>
      <p>{company.description}</p>
      <h2>Jobs at {company.name}</h2>
      <ul>
        {company.jobs.map((job) => (
          <li key={job.id}>
            <Link to={`/jobs/${job.id}`}>
              <strong>{job.title}</strong> -{' '}
              {job.salary ? `$${job.salary}` : 'No salary info'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompanyDetail;
