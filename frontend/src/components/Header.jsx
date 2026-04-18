import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f0f0f0' }}>
      <div>
        <Link to="/">Home</Link>
        <Link to="/community" style={{ marginLeft: '1rem' }}>Community</Link>
        {user && <Link to="/profile" style={{ marginLeft: '1rem' }}>Profile</Link>}
        {user && <Link to="/dashboard" style={{ marginLeft: '1rem' }}>Dashboard</Link>}
        {user && <Link to="/upload" style={{ marginLeft: '1rem' }}>Upload Video</Link>}
      </div>
      <div>
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" style={{ marginLeft: '1rem' }}>Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;