import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error logging in', error);
      throw new Error(error.response?.data?.message || 'An error occurred during login');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const checkAuth = async (token) => {
    try {
      await axios.get('http://localhost:5000/auth/check', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error checking token', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, checkAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
