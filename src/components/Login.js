import React, { useState } from 'react';
import JoblyApi from '../api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ login }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // Use JoblyApi to log in
      const token = await JoblyApi.login({
        username: formData.username.trim(),
        password: formData.password.trim(),
      });

      // Call the login function with the token and username
      login(token, formData.username);
      setError(null);
      navigate('/');
    } catch (err) {
      // Display error message if login fails
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error.message); // Display backend error
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }

  return (
    <div className="login-container">
      <h1>Log In</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
