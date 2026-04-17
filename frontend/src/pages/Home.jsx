import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get('/videos');
        setVideos(response.data.data);
      } catch (error) {
        console.error('Failed to fetch videos', error);
      }
    };
    fetchVideos();
  }, []);

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