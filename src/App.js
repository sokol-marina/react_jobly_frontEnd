import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Companies from './components/Companies';
import CompanyDetail from './components/CompanyDetail';
import Jobs from './components/Jobs';
import Profile from './components/Profile';
import JoblyApi from './api';
import JobDetail from './components/JobDetail';
import './App.css';

function App() {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');

    if (storedToken && storedUserName) {
      JoblyApi.token = storedToken; // Set token in JoblyApi
      setToken(storedToken);
      setUserName(storedUserName);
      async function fetchCurrentUser() {
        try {
          const user = await JoblyApi.getCurrentUser(storedUserName);
          setCurrentUser(user);
        } catch (err) {
          console.error('Failed to fetch current user:', err);
          setCurrentUser(null);
        }
      }
      fetchCurrentUser();
    }
  }, []);

  function login(newToken, newUserName) {
    // Set the token in JoblyApi
    JoblyApi.token = newToken;

    // Store token and username in localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', newUserName);

    // Update state
    setToken(newToken);
    setUserName(newUserName);
  }

  const logout = () => {
    // Clear token from JoblyApi and localStorage
    JoblyApi.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    // Reset state
    setToken(null);
    setCurrentUser(null);
    setUserName('');
  };

  return (
    <Router>
      <Navigation
        token={token}
        currentUser={currentUser}
        userName={userName}
        l
        logout={logout}
      />
      <MainContent
        token={token}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        userName={userName}
        login={login}
      />
    </Router>
  );
}

function MainContent({ token, currentUser, setCurrentUser, login }) {
  const location = useLocation();

  return (
    <div className="main-content">
      {/* Display the welcome message only on the main page (/) */}
      {location.pathname === '/' && (
        <div className="welcome-container">
          <h1>Jobly</h1>
          <p>All the jobs in one, convenient place.</p>
          {token ? (
            <h2>Welcome Back, {currentUser?.firstName || 'User'}!</h2>
          ) : (
            <p>Please log in to get started.</p>
          )}
        </div>
      )}

      <Routes>
        <Route path="/login" element={<Login login={login} />} />
        <Route path="/register" element={<Register login={login} />} />
        {token && (
          <>
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:handle" element={<CompanyDetail />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route
              path="/profile"
              element={
                <Profile
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
