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
          api.get('/likes/videos'),
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
      <div className="page-section">
        <h1>Profile</h1>
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-section">
        <h1>Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-section">
      <div className="channel-hero">
        <img
          src={currentUser?.avtar || channelProfile?.avatar || '/fallback-avatar.png'}
          alt="Avatar"
          className="profile-avatar"
        />
        <div className="channel-copy">
          <p className="eyebrow">Your channel</p>
          <h2>{currentUser?.fullname || currentUser?.username}</h2>
          <p>@{currentUser?.username}</p>
          <p>{currentUser?.email}</p>
        </div>
      </div>

      <div className="tab-row">
        <button
          onClick={() => setActiveTab('channel')}
          className={activeTab === 'channel' ? 'tab-button active' : 'tab-button'}
        >
          Channel
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={activeTab === 'history' ? 'tab-button active' : 'tab-button'}
        >
          Watch History
        </button>
        <button
          onClick={() => setActiveTab('likes')}
          className={activeTab === 'likes' ? 'tab-button active' : 'tab-button'}
        >
          Liked Videos
        </button>
      </div>

      {activeTab === 'channel' && (
        <div className="panel">
          <h2>Channel Info</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <strong>Subscribers</strong>
              <p>{channelProfile?.subscribersCount ?? 0}</p>
            </div>
            <div className="stat-card">
              <strong>Subscriptions</strong>
              <p>{channelProfile?.subscribedToCount ?? 0}</p>
            </div>
            <div className="stat-card">
              <strong>Channel Name</strong>
              <p>{channelProfile?.username}</p>
            </div>
            <div className="stat-card">
              <strong>Full Name</strong>
              <p>{channelProfile?.fullname}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="panel">
          <h2>Watch History</h2>
          {watchHistory.length === 0 ? (
            <p>You haven't watched any videos yet.</p>
          ) : (
            <div className="stack-list">
              {watchHistory.map((video) => (
                <div key={video._id} className="list-row">
                  <img src={video.thumbnail} alt={video.title} />
                  <div>
                    <strong>{video.title}</strong>
                    <p>{video.description}</p>
                    <p>By {video.owner?.fullname || video.owner?.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'likes' && (
        <div className="panel">
          <h2>Liked Videos</h2>
          {likedVideos.length === 0 ? (
            <p>You haven't liked any videos yet.</p>
          ) : (
            <div className="stack-list">
              {likedVideos.map((video) => (
                <div key={video._id} className="list-row">
                  <img src={video.thumbnail} alt={video.title} />
                  <div>
                    <strong>{video.title}</strong>
                    <p>{video.description || 'No description available'}</p>
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
