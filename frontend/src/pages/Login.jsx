import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-promo">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to TweetTube</h1>
        <p>Jump back into your subscriptions, likes, uploads, and community feed.</p>
      </section>

      <form onSubmit={handleSubmit} className="panel auth-form">
        <h2>Login</h2>
        <label className="field">
          <span>Email or username</span>
          <input
            type="text"
            placeholder="Email or username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="primary-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
