import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../components/AuthContext';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await api.get(`/videos/${videoId}`);
        setVideo(response.data.data);

        if (user) {
          await api.post('/users/history', { videoId });
        }

        const likeResponse = await api.get('/likes/videos');
        setLikeCount(likeResponse.data.data.length);
      } catch (error) {
        console.error('Failed to fetch video', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/${videoId}`);
        setComments(response.data.data);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    fetchVideo();
    fetchComments();
  }, [videoId, user]);

  const handleToggleLike = async () => {
    try {
      await api.post(`/likes/toggle/v/${videoId}`);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error('Failed to toggle like', error);
      alert(error.response?.data?.message || 'Failed to toggle like');
    }
  };

  const handleToggleSubscribe = async () => {
    if (!user) {
      alert('Please login to subscribe');
      return;
    }

    try {
      await api.post(`/subscriptions/c/${video.owner._id}`);
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.error('Failed to toggle subscription', error);
      alert(error.response?.data?.message || 'Failed to toggle subscription');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await api.post(`/comments/${videoId}`, { content: newComment });
      setNewComment('');
      const response = await api.get(`/comments/${videoId}`);
      setComments(response.data.data);
    } catch (error) {
      console.error('Failed to add comment', error);
      alert(error.response?.data?.message || 'Failed to add comment');
    }
  };

  if (!video) return <div className="page-section">Loading...</div>;

  return (
    <div className="watch-layout">
      <section className="watch-main">
        <div className="video-player-shell">
          <video controls>
            <source src={video.videoFile} type="video/mp4" />
          </video>
        </div>

        <h1 className="watch-title">{video.title}</h1>

        <div className="watch-actions">
          <div className="channel-summary">
            <span className="avatar-badge large">
              {(video.owner?.username || 'T').slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{video.owner?.username || 'TweetTube creator'}</strong>
              <p>{video.owner?.email || 'Channel owner'}</p>
            </div>
          </div>

          <div className="watch-buttons">
            <button onClick={handleToggleLike} className="pill-link emphasis button-reset">
              {isLiked ? 'Unlike' : 'Like'} ({likeCount})
            </button>
            {video.owner && (
              <button onClick={handleToggleSubscribe} className="pill-link button-reset">
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        </div>

        <div className="description-box">
          <p>{video.description}</p>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h2>Comments</h2>
            <p>{comments.length} responses</p>
          </div>

          {user && (
            <div className="comment-composer">
              <input
                type="text"
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                placeholder="Add a comment"
              />
              <button onClick={handleAddComment} className="primary-button">
                Comment
              </button>
            </div>
          )}

          {!user && <p>Please login to comment</p>}

          <div className="stack-list">
            {comments.map((comment) => (
              <article key={comment._id} className="comment-row">
                <span className="avatar-badge">
                  {(comment.owner?.username || 'A').slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <strong>{comment.owner?.fullname || comment.owner?.username || 'Anonymous'}</strong>
                  <p>{comment.content}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <aside className="watch-side">
        <div className="panel sticky-panel">
          <p className="eyebrow">More from TweetTube</p>
          <h2>Keep exploring</h2>
          <div className="stack-list">
            <Link to="/" className="promo-card">
              <strong>Back to Home</strong>
              <span>Browse the latest uploads</span>
            </Link>
            <Link to="/community" className="promo-card">
              <strong>Community Feed</strong>
              <span>See what creators are posting</span>
            </Link>
            <Link to="/upload" className="promo-card">
              <strong>Upload next</strong>
              <span>Publish your own video</span>
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default VideoPlayer;
