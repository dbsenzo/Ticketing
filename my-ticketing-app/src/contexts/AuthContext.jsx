import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      checkAuth(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/auth/check', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsLoggedIn(true);
      setRole(response.data.role);
    } catch (error) {
      console.error('Error checking token', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password, navigate) => {
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setRole(response.data.role);
      navigate('/projects');
      toast.success('Login successful!');
    } catch (error) {
      console.error('Error logging in', error);
      throw new Error(error.response?.data?.message || 'An error occurred during login');
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRole(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
