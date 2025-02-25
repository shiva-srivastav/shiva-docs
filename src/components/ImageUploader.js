// src/components/ImageUploader.js
import React, { useState } from 'react';
import '../styles/ImageUploader.css';

const ImageUploader = ({ onImageUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  
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
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };
  
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };
  
  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setMessage('Please select image files only');
      return;
    }
    
    // Store image data
    const newImages = imageFiles.map(file => ({
      file,
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      uploaded: false
    }));
    
    setImages(prev => [...prev, ...newImages]);
    setMessage('');
  };
  
  const removeImage = (id) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      
      // Revoke object URLs to avoid memory leaks
      const removed = prev.find(img => img.id === id);
      if (removed && removed.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      
      return filtered;
    });
  };
  
  const uploadImages = async () => {
    if (images.length === 0 || images.every(img => img.uploaded)) {
      return;
    }
    
    setUploading(true);
    setMessage('');
    
    try {
      // In a real application, you would upload the images to your server
      // For this demo, we'll simulate the upload with a timeout
      
      setTimeout(() => {
        // Mark all images as uploaded
        setImages(prev => prev.map(img => ({
          ...img,
          uploaded: true
        })));
        
        // Notify the parent component
        if (onImageUploaded) {
          const uploadedImages = images.map(img => ({
            name: img.name,
            url: `/content/images/${img.name}`,
            size: img.size
          }));
          
          onImageUploaded(uploadedImages);
        }
        
        setMessage('Images uploaded successfully!');
        setUploading(false);
      }, 1500);
    } catch (error) {
      setMessage(`Error uploading images: ${error.message}`);
      setUploading(false);
    }
  };
  
  return (
    <div className="image-uploader">
      <h3>Upload Images</h3>
      
      <div 
        className={`image-drop-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
        <p>Drag & drop images here, or</p>
        <input
          type="file"
          id="image-input"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
        />
        <label htmlFor="image-input" className="browse-button">
          Browse files
        </label>
      </div>
      
      {images.length > 0 && (
        <div className="image-preview-container">
          <div className="image-grid">
            {images.map(img => (
              <div key={img.id} className={`image-item ${img.uploaded ? 'uploaded' : ''}`}>
                <img src={img.preview} alt={img.name} className="image-preview" />
                <div className="image-info">
                  <div className="image-name">{img.name}</div>
                  <div className="image-size">{(img.size / 1024).toFixed(1)} KB</div>
                </div>
                <button 
                  className="remove-image" 
                  onClick={() => removeImage(img.id)}
                  disabled={uploading}
                >
                  ✕
                </button>
                {img.uploaded && (
                  <div className="upload-status">✓</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="upload-actions">
            <button 
              className="upload-button" 
              onClick={uploadImages}
              disabled={uploading || images.length === 0 || images.every(img => img.uploaded)}
            >
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            
            {message && (
              <div className={`upload-message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="image-usage-info">
        <h4>Using Images in Markdown</h4>
        <p>After uploading, you can use images in your markdown with this syntax:</p>
        <pre>![Alt text](/content/images/your-image.png)</pre>
      </div>
    </div>
  );
};

export default ImageUploader;