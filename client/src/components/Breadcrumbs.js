// src/components/Breadcrumbs.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import '../styles/Breadcrumbs.css';

const Breadcrumbs = () => {
  const { category, page } = useParams();
  const { sidebarData } = useContent();
  
  if (!category) {
    return null;
  }
  
  // Find category and page names
  const categoryData = sidebarData.find(item => item.slug === category);
  const categoryName = categoryData ? categoryData.name : category;
  
  let pageName = page;
  if (categoryData) {
    const pageData = categoryData.items.find(item => item.slug === page);
    if (pageData) {
      pageName = pageData.name;
    }
  }
  
  return (
    <div className="breadcrumbs">
      <Link to="/">Home</Link>
      <span className="separator">›</span>
      <Link to={`/${category}`}>{categoryName}</Link>
      {page && (
        <>
          <span className="separator">›</span>
          <span className="current">{pageName}</span>
        </>
      )}
    </div>
  );
};

export default Breadcrumbs;