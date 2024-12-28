import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ token, userName, logout }) {
  return (
    <nav className="nav">
      <div className="logo">
        <Link to="/" className="link">
          <h1>Jobly</h1>
        </Link>
      </div>
      <div className="links">
        {token ? (
          // Display these links if the user is logged in
          <>
            <Link to="/companies" className="link">
              Companies
            </Link>
            <Link to="/jobs" className="link">
              Jobs
            </Link>
            <Link to="/profile" className="link">
              Profile
            </Link>
            <button onClick={logout} className="logout-button">
              Log out {userName}
            </button>
          </>
        ) : (
          // Display these links if the user is not logged in
          <>
            <Link to="/login" className="link">
              Log In
            </Link>
            <Link to="/register" className="link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
