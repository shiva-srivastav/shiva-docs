// src/components/ThemeToggle.js
import React, { useState, useEffect } from 'react';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('auto');
  
  useEffect(() => {
    // Check if a theme is stored in localStorage
    const savedTheme = localStorage.getItem('shiva-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to auto theme
      applyTheme('auto');
    }
  }, []);
  
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light-theme', 'dark-theme');
    
    if (newTheme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    } else {
      // Apply the selected theme
      root.classList.add(`${newTheme}-theme`);
    }
  };
  
  const handleThemeChange = () => {
    // Cycle through themes: auto -> light -> dark -> auto
    const nextTheme = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto';
    setTheme(nextTheme);
    localStorage.setItem('shiva-theme', nextTheme);
    applyTheme(nextTheme);
  };
  
  return (
    <button className="theme-toggle" onClick={handleThemeChange}>
      {theme === 'auto' && 'Auto'}
      {theme === 'light' && 'Light'}
      {theme === 'dark' && 'Dark'}
    </button>
  );
};

export default ThemeToggle;