// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// API URL - make sure this matches your server
const API_URL = 'http://localhost:5000/api';

// Create the auth context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for token on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication on startup...');
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token found in localStorage');
        setLoading(false);
        return;
      }
      
      try {
        console.log('Token found, validating with server...');
        // Validate token with the server
        const response = await fetch(`${API_URL}/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Token validated successfully:', data);
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          console.log('Token validation failed on server');
          // Token invalid or expired
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    console.log('Attempting login for:', username);
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.log('Login failed:', data.error);
        throw new Error(data.error || 'Login failed');
      }
      
      console.log('Login successful, storing token');
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      
      // Set auth state
      setUser(data.user);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get auth header (for API requests)
  const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};