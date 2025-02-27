// src/components/FileManager.js
import React, { useState, useCallback } from 'react';
import '../styles/FileManager.css';

const FileManager = ({ onFileAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Generate a slug from the title
  const generateSlug = useCallback((text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }, []);

  // Handle title change and auto-generate slug
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.md')) {
      setFile(droppedFile);
      
      // Try to extract a title from the filename
      const filename = droppedFile.name.replace('.md', '');
      if (!title) {
        setTitle(filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        setSlug(filename);
      }
    } else {
      setMessage('Please drop a markdown (.md) file');
      setMessageType('error');
    }
  };

  // Handle file selection via input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.md')) {
      setFile(selectedFile);
      
      // Try to extract a title from the filename
      const filename = selectedFile.name.replace('.md', '');
      if (!title) {
        setTitle(filename.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
        setSlug(filename);
      }
    } else {
      setMessage('Please select a markdown (.md) file');
      setMessageType('error');
      setFile(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory || !title || !slug || !file) {
      setMessage('Please fill out all fields');
      setMessageType('error');
      return;
    }
    
    try {
      // In a real application, you would upload the file to your server
      // Here, we'll simulate this with a timeout
      
      // Read the file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target.result;
        
        // In a real app, you would make an API call here
        // For this demo, we'll just simulate success
        setTimeout(() => {
          // Call the callback with the new file info
          onFileAdded({
            category: selectedCategory,
            title: title,
            slug: slug,
            content: content
          });
          
          setMessage('File uploaded successfully!');
          setMessageType('success');
          
          // Reset form
          setSelectedCategory('');
          setTitle('');
          setSlug('');
          setFile(null);
        }, 1000);
      };
      
      reader.readAsText(file);
    } catch (error) {
      setMessage(`Error uploading file: ${error.message}`);
      setMessageType('error');
    }
  };

  return (
    <div className="file-manager">
      <h2>Add New Documentation</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="basics">Basics</option>
            <option value="tutorials">Tutorials</option>
            <option value="api">API</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter page title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="slug">Slug (URL):</label>
          <input
            type="text"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="page-url-slug"
            required
          />
          <small>This will be used in the URL: /category/slug</small>
        </div>
        
        <div 
          className={`file-drop-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="selected-file">
              <span className="file-name">{file.name}</span>
              <button 
                type="button" 
                className="remove-file" 
                onClick={() => setFile(null)}
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <div className="drop-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p>Drag & drop your markdown file here, or</p>
              <input
                type="file"
                id="markdown-file"
                accept=".md"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="markdown-file" className="browse-button">
                Browse files
              </label>
            </>
          )}
        </div>
        
        <button type="submit" className="submit-button" disabled={!selectedCategory || !title || !slug || !file}>
          Upload Document
        </button>
      </form>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileManager;