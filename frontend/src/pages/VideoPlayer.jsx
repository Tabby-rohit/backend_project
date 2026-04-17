import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
        // Fetch like count
        const likeResponse = await api.get(`/likes/videos`);
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
  }, [videoId]);

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

  if (!video) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{video.title}</h1>
      <video controls style={{ width: '100%', maxHeight: '500px' }}>
        <source src={video.videoFile} type="video/mp4" />
      </video>
      <p>{video.description}</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={handleToggleLike} style={{ padding: '0.5rem 1rem' }}>
          {isLiked ? '👍 Unlike' : '👍 Like'} ({likeCount})
        </button>
        {video.owner && (
          <>
            <div style={{ padding: '0.5rem 1rem' }}>
              Channel: <strong>{video.owner.username}</strong>
            </div>
            <button onClick={handleToggleSubscribe} style={{ padding: '0.5rem 1rem' }}>
              {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
          </>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Comments</h3>
        {user && (
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              style={{ width: '100%', padding: '0.5rem' }}
            />
            <button onClick={handleAddComment} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
              Comment
            </button>
          </div>
        )}
        {!user && <p>Please login to comment</p>}
        <ul>
          {comments.map(comment => (
            <li key={comment._id} style={{ marginBottom: '0.5rem' }}>
              <strong>{comment.owner?.fullname || comment.owner?.username || 'Anonymous'}</strong>: {comment.content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayer;