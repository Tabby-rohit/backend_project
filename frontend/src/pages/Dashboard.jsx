import React, { useEffect, useState } from 'react';
import api from '../api/api';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    const fetchVideos = async () => {
      try {
        const response = await api.get('/dashboard/videos');
        setVideos(response.data.data);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      }
    };
    fetchStats();
    fetchVideos();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Stats</h2>
        <p>Total Views: {stats.totalViews}</p>
        <p>Total Subscribers: {stats.totalSubscribers}</p>
        <p>Total Videos: {stats.totalVideos}</p>
      </div>
      <div>
        <h2>Your Videos</h2>
        <ul>
          {videos.map(video => (
            <li key={video._id}>{video.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;