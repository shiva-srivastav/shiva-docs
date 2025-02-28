// src/components/ContentActions.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import '../styles/ContentActions.css';

const ContentActions = ({ category, slug, title }) => {
  const { deleteContent } = useContent();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin?category=${category}&slug=${slug}`);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const success = await deleteContent(category, slug);
      
      if (success) {
        // Redirect to category page after successful deletion
        navigate(`/${category}`);
      } else {
        setError('Failed to delete content. Please try again.');
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Error deleting content:", err);
      setError('An error occurred while deleting. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="content-actions">
      {error && <div className="content-action-error">{error}</div>}
      
      <button 
        className="edit-button" 
        onClick={handleEdit}
        title="Edit this page"
      >
        <EditIcon /> Edit
      </button>
      
      <button 
        className="delete-button" 
        onClick={handleDelete}
        disabled={isDeleting}
        title="Delete this page"
      >
        {isDeleting ? 'Deleting...' : (
          <>
            <DeleteIcon /> Delete
          </>
        )}
      </button>
    </div>
  );
};

// Simple SVG icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

export default ContentActions;