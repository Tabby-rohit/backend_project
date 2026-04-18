import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const categories = ['All', 'Music', 'Coding', 'Gaming', 'Podcasts', 'Design', 'Live'];

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/videos');
        setVideos(response.data.data?.docs || response.data.data || []);
        setError(null);
      } catch (fetchError) {
        console.error('Failed to fetch videos', fetchError);
        setError('Failed to load videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div className="page-section"><h1>Loading videos...</h1></div>;
  if (error) return <div className="page-section"><h1>Error: {error}</h1></div>;

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div>
          <p className="eyebrow">New identity</p>
          <h1>TweetTube</h1>
          <p className="hero-copy">
            A YouTube-inspired home feed for your video platform, wrapped in a sharper
            creator-first brand.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>{videos.length}</strong>
            <span>Videos live</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Creator energy</span>
          </div>
        </div>
      </section>

      <section className="category-row">
        {categories.map((category, index) => (
          <button key={category} className={index === 0 ? 'category-chip active' : 'category-chip'}>
            {category}
          </button>
        ))}
      </section>

      {videos.length === 0 ? (
        <div className="empty-state">
          <h2>No videos available yet</h2>
          <p>Upload the first TweetTube video to bring the feed to life.</p>
        </div>
      ) : (
        <section className="video-grid">
          {videos.map((video) => (
            <article key={video._id} className="video-card">
              <Link to={`/video/${video._id}`} className="video-thumb">
                <img src={video.thumbnail} alt={video.title} />
                <span className="video-duration">{Math.ceil(video.duration || 0)} min</span>
              </Link>

              <div className="video-meta">
                <div className="channel-dot" aria-hidden="true">
                  {(video.owner?.username || video.title || 'T').slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <Link to={`/video/${video._id}`} className="video-title">
                    {video.title}
                  </Link>
                  <p className="video-subtitle">{video.owner?.username || 'TweetTube creator'}</p>
                  <p className="video-description">{video.description}</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Home;
