import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await api.get(`/videos/${videoId}`);
        setVideo(response.data.data);
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

  const handleAddComment = async () => {
    try {
      await api.post(`/comments/${videoId}`, { content: newComment });
      setNewComment('');
      // Refresh comments
      const response = await api.get(`/comments/${videoId}`);
      setComments(response.data.data);
    } catch (error) {
      alert('Failed to add comment');
    }
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div>
      <h1>{video.title}</h1>
      <video controls style={{ width: '100%' }}>
        <source src={video.videoFile} type="video/mp4" />
      </video>
      <p>{video.description}</p>
      <div>
        <h3>Comments</h3>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment}>Comment</button>
        <ul>
          {comments.map(comment => (
            <li key={comment._id}>{comment.content}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayer;