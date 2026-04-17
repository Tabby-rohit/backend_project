import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/videos');
        console.log('Videos response:', response.data);
        setVideos(response.data.data?.docs || response.data.data || []);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch videos', error);
        setError('Failed to load videos');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) return <div><h1>Loading videos...</h1></div>;
  if (error) return <div><h1>Error: {error}</h1></div>;
  if (videos.length === 0) return <div><h1>No videos available</h1></div>;

  return (
    <div>
      <h1>Videos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {videos.map(video => (
          <div key={video._id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <Link to={`/video/${video._id}`}>
              <img src={video.thumbnail} alt={video.title} style={{ width: '100%' }} />
              <h3>{video.title}</h3>
            </Link>
            <p>{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;