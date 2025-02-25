// src/components/CommunityBox.js
import React from 'react';
import '../styles/CommunityBox.css';

const CommunityBox = () => {
  return (
    <div className="community-box">
      <div className="community-box-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
      <h3>Learn and community</h3>
      <p>Check out our wide range of <a href="#">our courses</a>.</p>
      <p>We have a <a href="#">Discord community</a> where you can ask questions and get help from the community.</p>
    </div>
  );
};

export default CommunityBox;