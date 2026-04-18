import React from 'react';
import { BrowserRouter as Router, NavLink, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadVideo from './pages/UploadVideo';
import VideoPlayer from './pages/VideoPlayer';
import Community from './pages/Community';
import Profile from './pages/Profile';

const sidebarLinks = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Studio' },
  { to: '/upload', label: 'Upload' },
  { to: '/community', label: 'Community' },
  { to: '/profile', label: 'Profile' },
];

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-shell">
          <Header />
          <div className="shell-layout">
            <aside className="sidebar">
              <div className="sidebar-group">
                {sidebarLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `sidebar-link${isActive ? ' active' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="sidebar-card">
                <p className="sidebar-card-kicker">Brand</p>
                <h3>TweetTube</h3>
                <p>Video streaming meets short-form community posting.</p>
              </div>
            </aside>

            <main className="app-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<UploadVideo />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/video/:videoId" element={<VideoPlayer />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
