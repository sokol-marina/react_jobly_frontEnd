import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Companies.css';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const params = searchTerm ? { name: searchTerm } : {};
        const response = await axios.get(
          'http://localhost:3001/companies',
          { params } // Pass search term as a query parameter
        );
        setCompanies(response.data.companies); // Set the fetched companies
        setLoading(false);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    }

    fetchCompanies();
  }, [searchTerm]);

  function handleSearch(evt) {
    setSearchTerm(evt.target.value); // Update the search term
  }

  if (loading) return <p>Loading companies...</p>;

  return (
    <div className="companies-container">
      <h1>Companies</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="companies-list">
        {companies.map((company) => (
          <div key={company.handle} className="company-card">
            <h2>
              <Link to={`/companies/${company.handle}`}>{company.name}</Link>
            </h2>
            <p>{company.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Companies;
