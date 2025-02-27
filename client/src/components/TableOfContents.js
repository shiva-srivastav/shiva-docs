// src/components/TableOfContents.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/TableOfContents.css';

const TableOfContents = ({ headings }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Convert heading text to a valid ID format
  const createId = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special chars
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/--+/g, '-');     // Replace multiple hyphens with single
  };

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Update URL with hash without triggering navigation
      window.history.pushState(null, '', `${location.pathname}#${id}`);
    }
  };

  return (
    <div className="table-of-contents">
      <h3>On this page</h3>
      <ul>
        {headings.map((heading, index) => {
          const id = createId(heading.title);
          return (
            <li
              key={index}
              className={`toc-level-${heading.level}`}
            >
              <a 
                href={`#${id}`}
                onClick={(e) => handleClick(e, id)}
              >
                {heading.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TableOfContents;