import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullname: '',
    avatar: null,
    coverImage: null,
  });
  const { register } = useAuth();
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
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      await register(data);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-promo">
        <p className="eyebrow">Start your channel</p>
        <h1>Create your TweetTube account</h1>
        <p>Set up your profile, customize your visuals, and start posting videos.</p>
      </section>

      <form onSubmit={handleSubmit} className="panel auth-form">
        <h2>Register</h2>

        <label className="field">
          <span>Username</span>
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Email</span>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Full name</span>
          <input type="text" name="fullname" placeholder="Full Name" onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Avatar</span>
          <input type="file" name="avatar" onChange={handleChange} accept="image/*" />
        </label>

        <label className="field">
          <span>Cover image</span>
          <input type="file" name="coverImage" onChange={handleChange} accept="image/*" />
        </label>

        <button type="submit" className="primary-button">
          Create account
        </button>
      </form>
    </div>
  );
};

export default Register;
