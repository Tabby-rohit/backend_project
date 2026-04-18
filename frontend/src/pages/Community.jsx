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
      setLikedTweets((prev) => {
        const next = new Set(prev);
        if (next.has(tweetId)) {
          next.delete(tweetId);
        } else {
          next.add(tweetId);
        }
        return next;
      });
    } catch (error) {
      console.error('Failed to toggle like', error);
      alert(error.response?.data?.message || 'Failed to toggle like');
    }
  };

  if (loading) return <div className="page-section">Loading...</div>;

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Pulse</p>
          <h1>TweetTube Community</h1>
          <p>Short posts from creators and viewers, inspired by the social side of the platform.</p>
        </div>
      </div>

      {user && (
        <div className="panel">
          <h3>What's on your mind?</h3>
          <textarea
            value={newTweet}
            onChange={(event) => setNewTweet(event.target.value)}
            placeholder="Share your thoughts..."
            className="tweet-box"
          />
          <button onClick={handleCreateTweet} className="primary-button">
            Tweet
          </button>
        </div>
      )}

      {!user && (
        <div className="empty-state compact">
          <p>Please login to create tweets</p>
        </div>
      )}

      <div className="stack-list">
        <h2>Community Feed</h2>
        {tweets.length === 0 ? (
          <p>No tweets yet. Be the first to share.</p>
        ) : (
          <div className="stack-list">
            {tweets.map((tweet) => (
              <div key={tweet._id} className="tweet-card">
                <div className="tweet-top">
                  <div>
                    <strong>{tweet.owner?.fullname || tweet.owner?.username || 'Anonymous'}</strong>
                    <span className="tweet-handle">@{tweet.owner?.username}</span>
                    <p className="tweet-date">{new Date(tweet.createdAt).toLocaleDateString()}</p>
                  </div>
                  {user && user._id === tweet.owner?._id && (
                    <button onClick={() => handleDeleteTweet(tweet._id)} className="ghost-button danger">
                      Delete
                    </button>
                  )}
                </div>

                <p className="tweet-content">{tweet.content}</p>

                <div>
                  <button
                    onClick={() => handleToggleLikeTweet(tweet._id)}
                    className={likedTweets.has(tweet._id) ? 'pill-link emphasis button-reset' : 'pill-link button-reset'}
                  >
                    Like
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
