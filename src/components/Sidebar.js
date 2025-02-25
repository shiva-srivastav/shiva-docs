// src/components/Sidebar.js (updated)
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const { sidebarData } = useContent();
  const location = useLocation();

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Check if we should expand a category based on the current path
  const shouldExpand = (categorySlug) => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1] === categorySlug) {
      return true;
    }
    return expandedCategories[categorySlug] || false;
  };

  // Check if an item is active
  const isItemActive = (categorySlug, itemSlug) => {
    return location.pathname === `/${categorySlug}/${itemSlug}`;
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/">Shiva Docs</Link>
      </div>
      <div className="sidebar-menu">
        {sidebarData.map((category) => (
          <div key={category.slug} className="category">
            <div 
              className="category-header" 
              onClick={() => toggleCategory(category.slug)}
            >
              <span>{category.name}</span>
              <span className={`arrow ${shouldExpand(category.slug) ? 'down' : 'right'}`}>›</span>
            </div>
            {shouldExpand(category.slug) && (
              <div className="subcategories">
                {category.items.map((item) => (
                  <Link 
                    key={item.slug} 
                    to={`/${category.slug}/${item.slug}`}
                    className={`subcategory-item ${isItemActive(category.slug, item.slug) ? 'active' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;