import React, { useEffect, useState } from 'react';
import api from '../api/api';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [videos, setVideos] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

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

  useEffect(() => {
    fetchStats();
    fetchVideos();
  }, []);

  const handleDeleteVideo = async (videoId) => {
    const confirmed = window.confirm('Delete this video from TweetTube?');
    if (!confirmed) return;

    try {
      setDeletingId(videoId);
      await api.delete(`/videos/${videoId}`);
      await Promise.all([fetchStats(), fetchVideos()]);
    } catch (error) {
      console.error('Failed to delete video', error);
      alert(error.response?.data?.message || 'Failed to delete video');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Creator studio</p>
          <h1>Channel Dashboard</h1>
          <p>Track how your TweetTube channel is performing.</p>
        </div>
      </div>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Views</span>
          <strong>{stats.totalViews ?? 0}</strong>
        </article>
        <article className="stat-card">
          <span>Subscribers</span>
          <strong>{stats.totalSubscribers ?? 0}</strong>
        </article>
        <article className="stat-card">
          <span>Videos</span>
          <strong>{stats.totalVideos ?? 0}</strong>
        </article>
        <article className="stat-card accent">
          <span>Likes</span>
          <strong>{stats.totalLikes ?? 0}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <h2>Your uploads</h2>
          <p>{videos.length} videos in your library</p>
        </div>

        {videos.length === 0 ? (
          <div className="empty-state compact">
            <p>No channel uploads yet. Publish a video to populate this studio.</p>
          </div>
        ) : (
          <div className="stack-list">
            {videos.map((video) => (
              <article key={video._id} className="list-row">
                <img src={video.thumbnail} alt={video.title} />
                <div className="list-row-body">
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
                <div className="list-row-actions">
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(video._id)}
                    className="ghost-button danger"
                    disabled={deletingId === video._id}
                  >
                    {deletingId === video._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
