import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="brand-mark" aria-hidden="true">
          <span className="brand-play"></span>
        </span>
        <span>
          <strong>TweetTube</strong>
          <small>stream, watch, share</small>
        </span>
      </Link>

      <div className="topbar-search">
        <input
          type="text"
          placeholder="Search videos, creators, tweets"
          aria-label="Search"
          readOnly
          value=""
        />
        <button type="button">Search</button>
      </div>

      <nav className="topbar-actions">
        <Link
          to="/community"
          className={location.pathname === '/community' ? 'pill-link active' : 'pill-link'}
        >
          Community
        </Link>
        {user ? (
          <>
            <Link to="/upload" className="pill-link emphasis">
              Create
            </Link>
            <Link to="/profile" className="profile-chip">
              <span className="avatar-badge">
                {(user.username || 'T').slice(0, 1).toUpperCase()}
              </span>
              <span>{user.username}</span>
            </Link>
            <button onClick={handleLogout} className="ghost-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="pill-link">
              Login
            </Link>
            <Link to="/register" className="pill-link emphasis">
              Join
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
