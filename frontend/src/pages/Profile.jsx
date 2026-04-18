import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../components/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [channelProfile, setChannelProfile] = useState(null);
  const [watchHistory, setWatchHistory] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState('channel');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const [meRes, channelRes, historyRes, likedRes] = await Promise.all([
          api.get('/users/current-user'),
          api.get(`/users/c/${user.username}/channel-profile`),
          api.get('/users/history'),
          api.get('/likes/videos')
        ]);

        setCurrentUser(meRes.data.data);
        setChannelProfile(channelRes.data.data);
        setWatchHistory(historyRes.data.data);
        setLikedVideos(likedRes.data.data);
      } catch (error) {
        console.error('Unable to load profile', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Profile</h1>
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Profile</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
        <img
          src={currentUser?.avtar || channelProfile?.avatar || '/fallback-avatar.png'}
          alt="Avatar"
          style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover' }}
        />
        <div>
          <h2>{currentUser?.fullname || currentUser?.username}</h2>
          <p style={{ margin: 0, color: '#555' }}>@{currentUser?.username}</p>
          <p style={{ margin: '0.5rem 0 0 0' }}>{currentUser?.email}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('channel')}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #ccc',
            background: activeTab === 'channel' ? '#222' : 'white',
            color: activeTab === 'channel' ? 'white' : 'black',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Channel
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #ccc',
            background: activeTab === 'history' ? '#222' : 'white',
            color: activeTab === 'history' ? 'white' : 'black',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Watch History
        </button>
        <button
          onClick={() => setActiveTab('likes')}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #ccc',
            background: activeTab === 'likes' ? '#222' : 'white',
            color: activeTab === 'likes' ? 'white' : 'black',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Liked Videos
        </button>
      </div>

      {activeTab === 'channel' && (
        <div>
          <h2>Channel Info</h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>Subscribers</strong>
              <p>{channelProfile?.subscribersCount ?? 0}</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>Subscriptions</strong>
              <p>{channelProfile?.subscribedToCount ?? 0}</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>Channel Name</strong>
              <p>{channelProfile?.username}</p>
            </div>
            <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <strong>Full Name</strong>
              <p>{channelProfile?.fullname}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h2>Watch History</h2>
          {watchHistory.length === 0 ? (
            <p>You haven't watched any videos yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {watchHistory.map((video) => (
                <div key={video._id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <img src={video.thumbnail} alt={video.title} style={{ width: '180px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div>
                    <strong>{video.title}</strong>
                    <p style={{ margin: '0.5rem 0 0 0' }}>{video.description}</p>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#555' }}>By {video.owner?.fullname || video.owner?.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'likes' && (
        <div>
          <h2>Liked Videos</h2>
          {likedVideos.length === 0 ? (
            <p>You haven't liked any videos yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {likedVideos.map((video) => (
                <div key={video._id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <img src={video.thumbnail} alt={video.title} style={{ width: '180px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div>
                    <strong>{video.title}</strong>
                    <p style={{ margin: '0.5rem 0 0 0' }}>{video.description || 'No description available'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
