// src/components/MarkdownUploader.js
import React, { useState } from 'react';
import '../styles/MarkdownUploader.css';

const MarkdownUploader = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.md')) {
      setFile(selectedFile);
    } else {
      setMessage('Please select a markdown (.md) file');
      setFile(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In a real application, you would upload the file to your server
    // and update your sidebar data
    
    // For this demo, we'll just show a success message
    if (title && category && file) {
      setMessage(`Successfully uploaded ${file.name} to ${category} category!`);
      
      // Reset form
      setTitle('');
      setCategory('');
      setFile(null);
      
      // In a real app, you would add the new file to your sidebarData
      // and save it to your content directory
    } else {
      setMessage('Please fill all fields');
    }
  };
  
  return (
    <div className="markdown-uploader">
      <h2>Upload New Markdown File</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="basics">Basics</option>
            <option value="tutorials">Tutorials</option>
            <option value="api">API</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="markdown-file">Markdown File:</label>
          <input
            type="file"
            id="markdown-file"
            accept=".md"
            onChange={handleFileChange}
            required
          />
        </div>
        
        <button type="submit" className="upload-button">Upload</button>
      </form>
      
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default MarkdownUploader;