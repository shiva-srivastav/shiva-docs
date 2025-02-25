// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const { sidebarData } = useContent();
  const location = useLocation();

  // Initialize expanded categories based on current path
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1) {
      const currentCategory = pathParts[1];
      setExpandedCategories(prev => ({
        ...prev,
        [currentCategory]: true
      }));
    }
  }, [location.pathname]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
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
      <nav className="sidebar-menu">
        {sidebarData.map((category) => (
          <div key={category.slug} className="category">
            <div 
              className="category-header" 
              onClick={() => toggleCategory(category.slug)}
            >
              <span>{category.name}</span>
              <span className={`arrow ${expandedCategories[category.slug] ? 'down' : 'right'}`}>›</span>
            </div>
            {expandedCategories[category.slug] && category.items && category.items.length > 0 && (
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
      </nav>
    </div>
  );
};

export default Sidebar;