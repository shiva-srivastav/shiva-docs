// src/components/Footer.js
import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          Shiva Docs
        </div>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="https://github.com/shiva-srivastav" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div className="footer-copyright">
          © {currentYear} Shiva Docs. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;