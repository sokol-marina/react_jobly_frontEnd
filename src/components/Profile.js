import React, { useState } from 'react';
import JoblyApi from '../api';
import './Profile.css';

function Profile({ currentUser, setCurrentUser }) {
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    password: '', // Password is required for updates
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // If currentUser is null, show a loading message
  if (!currentUser) {
    return <p>Loading profile...</p>;
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await JoblyApi.updateUser(currentUser.username, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      setCurrentUser(updatedUser); // Update the current user in state
      setSuccess(true); // Show success message
    } catch (err) {
      console.error('Update Error:', err);
      setError(err[0] || 'An unexpected error occurred.');
    }
  }

  return (
    <div className="profile-container">
      <h1>Edit Profile</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">Profile updated successfully!</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username (read-only)</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          readOnly
        />
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default Profile;
