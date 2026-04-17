import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { useAuth } from '../components/AuthContext';

const Community = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedTweets, setLikedTweets] = useState(new Set());

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tweets');
      setTweets(response.data.data);
    } catch (error) {
      console.error('Failed to fetch tweets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTweet = async () => {
    if (!newTweet.trim()) {
      alert('Please write something to tweet');
      return;
    }
    try {
      await api.post('/tweets', { content: newTweet });
      setNewTweet('');
      fetchTweets();
    } catch (error) {
      console.error('Failed to create tweet', error);
      alert(error.response?.data?.message || 'Failed to create tweet');
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm('Are you sure you want to delete this tweet?')) return;
    try {
      await api.delete(`/tweets/${tweetId}`);
      fetchTweets();
    } catch (error) {
      console.error('Failed to delete tweet', error);
      alert(error.response?.data?.message || 'Failed to delete tweet');
    }
  };

  const handleToggleLikeTweet = async (tweetId) => {
    try {
      await api.post(`/likes/toggle/t/${tweetId}`);
      setLikedTweets(prev => {
        const newSet = new Set(prev);
        if (newSet.has(tweetId)) {
          newSet.delete(tweetId);
        } else {
          newSet.add(tweetId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Failed to toggle like', error);
      alert(error.response?.data?.message || 'Failed to toggle like');
    }
  };

  if (loading) return <div style={{ padding: '1rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Community</h1>

      {user && (
        <div style={{
          background: '#f5f5f5',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #ddd'
        }}>
          <h3>What's on your mind?</h3>
          <textarea
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="Share your thoughts..."
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              minHeight: '100px',
              fontFamily: 'Arial, sans-serif',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleCreateTweet}
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem 1.5rem',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Tweet
          </button>
        </div>
      )}

      {!user && (
        <div style={{
          background: '#fff3cd',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem',
          border: '1px solid #ffc107'
        }}>
          <p>Please login to create tweets</p>
        </div>
      )}

      <div>
        <h2>Community Feed</h2>
        {tweets.length === 0 ? (
          <p>No tweets yet. Be the first to share!</p>
        ) : (
          <div>
            {tweets.map(tweet => (
              <div
                key={tweet._id}
                style={{
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <strong>{tweet.owner?.fullname || tweet.owner?.username || 'Anonymous'}</strong>
                    <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                      @{tweet.owner?.username}
                    </span>
                    <p style={{ color: '#999', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
                      {new Date(tweet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {user && user._id === tweet.owner?._id && (
                    <button
                      onClick={() => handleDeleteTweet(tweet._id)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>

                <p style={{ margin: '1rem 0' }}>{tweet.content}</p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => handleToggleLikeTweet(tweet._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: likedTweets.has(tweet._id) ? '#dc3545' : '#e9ecef',
                      color: likedTweets.has(tweet._id) ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ❤️ Like
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
