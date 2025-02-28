// src/components/TableOfContents.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/TableOfContents.css';

const TableOfContents = ({ markdown }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const location = useLocation();

  // Extract headings from markdown content
  useEffect(() => {
    if (!markdown) return;

    try {
      // Regular expression to match headings (# Heading, ## Heading, ### Heading)
      // Captures the heading level and text, handling various markdown formats
      const headingRegex = /^(#{1,3})\s+(.*?)$/gm;
      const extractedHeadings = [];
      let match;

      while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length; // Number of # symbols
        const title = match[2].trim();
        
        // Clean the title of any markdown formatting
        const cleanTitle = title
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1')     // Remove italic
          .replace(/`(.*?)`/g, '$1')       // Remove code
          .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
          .trim();
        
        const id = createId(cleanTitle);
        
        extractedHeadings.push({ level, title: cleanTitle, id });
      }

      setHeadings(extractedHeadings);
    } catch (error) {
      console.error('Error extracting headings:', error);
      setHeadings([]);
    }
  }, [markdown]);

  // Track active heading based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;

      // Get all heading elements
      const headingElements = headings.map(heading => 
        document.getElementById(heading.id)
      ).filter(Boolean);

      if (headingElements.length === 0) return;

      // Find the heading that's currently in view
      const scrollPosition = window.scrollY + 100;
      let currentHeading = headingElements[0];

      for (const heading of headingElements) {
        if (heading.offsetTop <= scrollPosition) {
          currentHeading = heading;
        } else {
          break;
        }
      }

      if (currentHeading) {
        setActiveId(currentHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  // Handle URL hash on load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveId(id);
        }, 100);
      }
    }
  }, [location.hash, headings]);

  // Convert heading text to a valid ID format
  const createId = (text) => {
    if (typeof text !== 'string') {
      if (Array.isArray(text)) {
        text = text.join('');
      } else {
        return '';
      }
    }
    
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  };

  // Handle click on a TOC item
  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      
      // Update URL with hash without triggering navigation
      window.history.pushState(null, '', `${location.pathname}#${id}`);
    }
  };

  // Don't render if no headings found
  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="table-of-contents">
      <h3>On this page</h3>
      <ul>
        {headings.map((heading, index) => (
          <li
            key={index}
            className={`toc-level-${heading.level} ${heading.id === activeId ? 'toc-active' : ''}`}
          >
            <a 
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;