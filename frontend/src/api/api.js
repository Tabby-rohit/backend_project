import axios from 'axios';

const defaultApiBaseUrl = `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
