import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null,
  });
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.videoFile) data.append('videoFile', formData.videoFile);
    if (formData.thumbnail) data.append('thumbnail', formData.thumbnail);

    try {
      await api.post('/videos', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Video uploaded successfully');
      navigate('/');
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || error.message || 'Upload failed');
    }
  };

  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Studio</p>
          <h1>Upload to TweetTube</h1>
          <p>Drop in a title, description, video file, and thumbnail to publish.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="panel upload-form">
        <div className="form-grid">
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              name="title"
              placeholder="Video title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field field-full">
            <span>Description</span>
            <textarea
              name="description"
              placeholder="Tell viewers what this video is about"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </label>

          <label className="field">
            <span>Video file</span>
            <input
              type="file"
              name="videoFile"
              onChange={handleChange}
              accept="video/*"
              required
            />
          </label>

          <label className="field">
            <span>Thumbnail</span>
            <input
              type="file"
              name="thumbnail"
              onChange={handleChange}
              accept="image/*"
              required
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">
            Publish Video
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadVideo;
