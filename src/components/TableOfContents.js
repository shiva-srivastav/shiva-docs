// src/components/TableOfContents.js
import React from 'react';
import '../styles/TableOfContents.css';

const TableOfContents = ({ headings }) => {
  const getSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div className="table-of-contents">
      <h3>On this page</h3>
      <ul>
        {headings.map((heading, index) => (
          <li
            key={index}
            className={`toc-level-${heading.level}`}
          >
            <a href={`#${getSlug(heading.title)}`}>{heading.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;