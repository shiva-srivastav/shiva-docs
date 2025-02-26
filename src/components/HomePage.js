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
          <p>Explore Shiva Docs to navigate various technical topics with structured documentation and hands-on tutorials.</p>
          <Link to="/basics/getting-started" className="card-link">
            Read More →
          </Link>
        </div>
        
        <div className="card">
          <h2>Tutorials</h2>
          <p>Master different technologies with step-by-step tutorials and real-world examples.</p>
          <Link to="/basics/shiva-docs-features" className="card-link">
            Read More →
          </Link>
        </div>
        
        <div className="card">
          <h2>Shiva Docs Features</h2>
          <p>Enhance your learning with Markdown support, smart navigation, and customization options.</p>
          <Link to="/basics/tutorials" className="card-link">
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;