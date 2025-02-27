// src/components/SearchBar.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { sidebarData } = useContent();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Flatten all content items for searching
  const allItems = sidebarData.reduce((acc, category) => {
    return [
      ...acc,
      ...category.items.map(item => ({
        category: category.slug,
        categoryName: category.name,
        ...item
      }))
    ];
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    
    if (searchQuery.length >= 2) {
      setIsSearching(true);
      setShowResults(true);
      
      // Filter items based on search query
      const searchResults = allItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(searchResults);
      setIsSearching(false);
    } else {
      setResults([]);
    }
  };

  // Handle clicking on a search result
  const handleResultClick = (category, slug) => {
    navigate(`/${category}/${slug}`);
    setShowResults(false);
    setQuery('');
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.querySelector('input')?.focus();
      }
      
      // Escape to close search results
      if (e.key === 'Escape' && showResults) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [showResults]);

  return (
    <div className="search-container" ref={searchRef}>
      <input
        type="text"
        className="search-input"
        placeholder="Search documentation..."
        value={query}
        onChange={handleSearchChange}
        onFocus={() => query.length >= 2 && setShowResults(true)}
      />
      <span className="keyboard-shortcut">Ctrl K</span>
      
      {showResults && (
        <div className="search-results">
          {isSearching ? (
            <div className="search-message">Searching...</div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((result, index) => (
                <li key={index} onClick={() => handleResultClick(result.category, result.slug)}>
                  <span className="result-category">{result.categoryName}</span>
                  <span className="result-title">{result.name}</span>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="search-message">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;