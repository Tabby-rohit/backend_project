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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div>
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            name="title"
            placeholder="Video title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            placeholder="Video description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <label>
          Video file (videoFile)
          <input
            type="file"
            name="videoFile"
            onChange={handleChange}
            accept="video/*"
            required
          />
        </label>
        <label>
          Thumbnail image (thumbnail)
          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
            accept="image/*"
            required
          />
        </label>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadVideo;