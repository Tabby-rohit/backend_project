import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadVideo from './pages/UploadVideo';
import VideoPlayer from './pages/VideoPlayer';
import Community from './pages/Community';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/community" element={<Community />} />
          <Route path="/video/:videoId" element={<VideoPlayer />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
