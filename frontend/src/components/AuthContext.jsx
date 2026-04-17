import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        try {
          const response = await api.get('/users/current-user');
          setUser(response.data.data);
        } catch (error) {
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    const { user, accesstoken } = response.data.data;
    localStorage.setItem('accessToken', accesstoken);
    setUser(user);
    return response.data;
  };

  const register = async (formData) => {
    const response = await api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const { user, accesstoken } = response.data.data;
    if (accesstoken) {
      localStorage.setItem('accessToken', accesstoken);
    }
    setUser(user);
    return response.data;
  };

  const logout = async () => {
    await api.post('/users/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};