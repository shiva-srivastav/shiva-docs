// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Shiva Docs</h1>
      <p>Explore our documentation to learn more about our projects and services.</p>
      
      <div className="featured-cards">
        <div className="card">
          <h2>Getting Started</h2>
          <p>Learn the basics and set up your environment.</p>
          <Link to="/basics/getting-started" className="card-link">
            Read More →
          </Link>
        </div>
        
        <div className="card">
          <h2>Tutorials</h2>
          <p>Step-by-step guides to help you build your first project.</p>
          <Link to="/basics/first-project" className="card-link">
            Read More →
          </Link>
        </div>
        
        <div className="card">
          <h2>API Reference</h2>
          <p>Detailed documentation for our APIs.</p>
          <Link to="/basics/overview" className="card-link">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;