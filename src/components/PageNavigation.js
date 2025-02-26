// src/components/PageNavigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PageNavigation.css';

const PageNavigation = ({ prevPage, nextPage }) => {
  return (
    <div className="page-navigation">
      <div className="navigation-links">
        {prevPage && (
          <Link to={`/${prevPage.category}/${prevPage.slug}`} className="prev-link">
            <span className="nav-arrow">←</span>
            <div className="nav-content">
              <span className="nav-direction">Previous</span>
              <span className="nav-title">{prevPage.title}</span>
            </div>
          </Link>
        )}
        
        {nextPage && (
          <Link to={`/${nextPage.category}/${nextPage.slug}`} className="next-link">
            <div className="nav-content">
              <span className="nav-direction">Next</span>
              <span className="nav-title">{nextPage.title}</span>
            </div>
            <span className="nav-arrow">→</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PageNavigation;