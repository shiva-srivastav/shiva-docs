// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';
import '../styles/Header.css';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="header">
      {/* Only one Shiva Docs title - in the SearchBar section */}
      <div className="search-section">
        <SearchBar />
      </div>
      
      <div className="header-actions">
        {isAuthenticated ? (
          <div className="auth-actions">
            <Link to="/admin" className="admin-link">Admin</Link>
            <button onClick={logout} className="logout-button">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-link">Admin Login</Link>
        )}
        
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;