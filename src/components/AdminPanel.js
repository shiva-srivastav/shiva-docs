// src/components/AdminPanel.js
import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const { 
    sidebarData, 
    addContent, 
    createCategory, 
    deleteContent, 
    deleteCategory, 
    refreshContent,
    loading
  } = useContent();
  
  // State for category creation
  const [newCategory, setNewCategory] = useState('');
  const [categoryMessage, setCategoryMessage] = useState({ text: '', type: '' });
  
  // State for content creation
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [contentMessage, setContentMessage] = useState({ text: '', type: '' });
  
  // State for markdown file upload
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // State for image upload
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageMessage, setImageMessage] = useState({ text: '', type: '' });
  
  // State for tab selection
  const [activeTab, setActiveTab] = useState('content');
  
  // References
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);
  
  // Fetch existing images
  const fetchImages = async () => {
    try {
      const API_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/admin/images`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.images && Array.isArray(data.images)) {
          setUploadedImages(data.images);
        }
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setImageMessage({
        text: 'Failed to load existing images',
        type: 'error'
      });
    }
  };
  
  // Handle creating a new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategory.trim()) {
      setCategoryMessage({ text: 'Category name is required', type: 'error' });
      return;
    }
    
    setCategoryMessage({ text: 'Creating category...', type: 'info' });
    
    const success = await createCategory(newCategory);
    
    if (success) {
      setCategoryMessage({ text: `Category "${newCategory}" created successfully`, type: 'success' });
      setNewCategory('');
    } else {
      setCategoryMessage({ text: 'Failed to create category', type: 'error' });
    }
  };
  
  // Handle deleting a category
  const handleDeleteCategory = async (category, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete the "${categoryName}" category? This will delete all content in this category and cannot be undone.`)) {
      return;
    }
    
    const success = await deleteCategory(category);
    
    if (success) {
      setCategoryMessage({ text: `Category "${categoryName}" deleted successfully`, type: 'success' });
    } else {
      setCategoryMessage({ text: `Failed to delete category "${categoryName}"`, type: 'error' });
    }
  };
  
  // Handle adding/updating content
  const handleAddContent = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory || !title || !slug || !markdownContent) {
      setContentMessage({ text: 'All fields are required', type: 'error' });
      return;
    }
    
    setContentMessage({ text: 'Saving content...', type: 'info' });
    
    const success = await addContent({
      category: selectedCategory,
      title,
      slug,
      content: markdownContent
    });
    
    if (success) {
      setContentMessage({ text: `Content "${title}" saved successfully`, type: 'success' });
    } else {
      setContentMessage({ text: 'Failed to save content', type: 'error' });
    }
  };
  
  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };
  
  // Generate a slug from text
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };
  
  // Handle markdown file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.md')) {
      setContentMessage({ text: 'Please upload a markdown (.md) file', type: 'error' });
      return;
    }
    
    setUploadedFile(file);
    
    // Extract title and slug from filename
    const fileName = file.name.replace('.md', '');
    if (!title) {
      const fileTitle = fileName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      setTitle(fileTitle);
    }
    
    if (!slug) {
      setSlug(fileName);
    }
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      setMarkdownContent(e.target.result);
    };
    reader.readAsText(file);
  };
  
  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    setImageMessage({ text: 'Uploading images...', type: 'info' });
    
    const newImages = [];
    const API_URL = 'http://localhost:5000/api';
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          continue;
        }
        
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`${API_URL}/admin/images`, {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          newImages.push({
            name: data.name,
            url: data.url,
            size: data.size,
            created: new Date().toISOString()
          });
        }
      }
      
      if (newImages.length > 0) {
        setUploadedImages(prev => [...prev, ...newImages]);
        setImageMessage({ 
          text: `Successfully uploaded ${newImages.length} image(s)`, 
          type: 'success' 
        });
        
        // Clear the file input
        imageInputRef.current.value = '';
      } else {
        setImageMessage({ 
          text: 'No images were uploaded', 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setImageMessage({ 
        text: 'Failed to upload images', 
        type: 'error' 
      });
    } finally {
      setUploadingImage(false);
    }
  };
  
  // Handle image deletion
  const handleDeleteImage = async (imageName) => {
    if (!window.confirm(`Are you sure you want to delete this image? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const API_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/admin/images/${imageName}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setUploadedImages(prev => prev.filter(img => img.name !== imageName));
        setImageMessage({
          text: 'Image deleted successfully',
          type: 'success'
        });
      } else {
        setImageMessage({
          text: 'Failed to delete image',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setImageMessage({
        text: 'Failed to delete image',
        type: 'error'
      });
    }
  };
  
  // Insert image URL into markdown content
  const insertImageUrl = (imageUrl) => {
    const imageMarkdown = `![Image](${imageUrl})`;
    
    // Insert at cursor position or at the end
    setMarkdownContent(prevContent => prevContent ? `${prevContent}\n\n${imageMarkdown}` : imageMarkdown);
  };
  
  // Copy image URL to clipboard
  const copyImageUrl = (imageUrl) => {
    navigator.clipboard.writeText(imageUrl).then(() => {
      setImageMessage({ text: 'Image URL copied to clipboard', type: 'success' });
      setTimeout(() => setImageMessage({ text: '', type: '' }), 3000);
    });
  };
  
  // Refresh all content from server
  const handleRefresh = async () => {
    await refreshContent();
    setContentMessage({ text: 'Content refreshed from server', type: 'success' });
  };
  
  if (loading) {
    return <div className="loading-message">Loading content structure...</div>;
  }
  
  return (
    <div className="admin-panel">
      <h1>Content Management</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button 
          className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button 
          className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          Images
        </button>
      </div>
      
      {activeTab === 'content' && (
        <div className="admin-section">
          <h2>Add/Edit Content</h2>
          
          {contentMessage.text && (
            <div className={`message ${contentMessage.type}`}>
              {contentMessage.text}
              <button 
                className="close-message" 
                onClick={() => setContentMessage({ text: '', type: '' })}
              >
                ×
              </button>
            </div>
          )}
          
          <form onSubmit={handleAddContent}>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {sidebarData.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Page Title"
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
            
            <div className="form-group">
              <label htmlFor="markdown-upload">Upload Markdown File (optional):</label>
              <input
                type="file"
                id="markdown-upload"
                accept=".md"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="file-input"
              />
              <div className="file-input-wrapper">
                <button
                  type="button"
                  className="file-input-button"
                  onClick={() => fileInputRef.current.click()}
                >
                  Choose File
                </button>
                <span className="file-name">
                  {uploadedFile ? uploadedFile.name : 'No file chosen'}
                </span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content (Markdown):</label>
              <textarea
                id="content"
                value={markdownContent}
                onChange={(e) => setMarkdownContent(e.target.value)}
                placeholder="# Page Title
                
Write your markdown content here..."
                rows="15"
                required
              ></textarea>
            </div>
            
            <div className="button-group">
              <button type="submit" className="submit-button">Save Content</button>
              <button 
                type="button" 
                className="refresh-button"
                onClick={handleRefresh}
              >
                Refresh Content
              </button>
            </div>
          </form>
          
          <div className="markdown-help">
            <h3>Markdown Tips</h3>
            <ul>
              <li><code># Heading 1</code> - Main title</li>
              <li><code>## Heading 2</code> - Section title</li>
              <li><code>### Heading 3</code> - Subsection title</li>
              <li><code>*italic*</code> or <code>_italic_</code> - <em>Italic text</em></li>
              <li><code>**bold**</code> or <code>__bold__</code> - <strong>Bold text</strong></li>
              <li><code>[Link text](URL)</code> - <a href="#">Link</a></li>
              <li><code>![Alt text](image-url)</code> - Image</li>
              <li><code>```language
  code block
```</code> - Code block with syntax highlighting</li>
              <li><code>- Item</code> - Bullet list</li>
              <li><code>1. Item</code> - Numbered list</li>
            </ul>
          </div>
        </div>
      )}
      
      {activeTab === 'categories' && (
        <div className="admin-section">
          <h2>Manage Categories</h2>
          
          {categoryMessage.text && (
            <div className={`message ${categoryMessage.type}`}>
              {categoryMessage.text}
              <button 
                className="close-message" 
                onClick={() => setCategoryMessage({ text: '', type: '' })}
              >
                ×
              </button>
            </div>
          )}
          
          <form onSubmit={handleCreateCategory} className="category-form">
            <div className="form-group">
              <label htmlFor="category-name">New Category Name:</label>
              <input
                type="text"
                id="category-name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Advanced Topics"
              />
            </div>
            <button type="submit" className="submit-button">Create Category</button>
          </form>
          
          <div className="category-list">
            <h3>Existing Categories</h3>
            {sidebarData.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              <ul>
                {sidebarData.map((category) => (
                  <li key={category.slug} className="category-item">
                    <div className="category-info">
                      <strong>{category.name}</strong>
                      <span className="category-slug">/{category.slug}/</span>
                      <span className="category-count">
                        {category.items ? category.items.length : 0} pages
                      </span>
                    </div>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteCategory(category.slug, category.name)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'images' && (
        <div className="admin-section">
          <h2>Manage Images</h2>
          
          {imageMessage.text && (
            <div className={`message ${imageMessage.type}`}>
              {imageMessage.text}
              <button 
                className="close-message" 
                onClick={() => setImageMessage({ text: '', type: '' })}
              >
                ×
              </button>
            </div>
          )}
          
          <div className="image-upload-section">
            <h3>Upload Images</h3>
            <p>Upload images to use in your markdown content.</p>
            
            <div className="form-group">
              <label htmlFor="image-upload">Select Images:</label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                ref={imageInputRef}
                className="file-input"
              />
              <div className="file-input-wrapper">
                <button
                  type="button"
                  className="file-input-button"
                  onClick={() => imageInputRef.current.click()}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Uploading...' : 'Choose Images'}
                </button>
                <span className="file-name">
                  Select one or more image files
                </span>
              </div>
            </div>
          </div>
          
          <div className="uploaded-images">
            <h3>Uploaded Images</h3>
            {uploadedImages.length === 0 ? (
              <p>No images uploaded yet.</p>
            ) : (
              <div className="image-grid">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="image-item">
                    <div className="image-preview">
                      <img src={image.url} alt={image.name} />
                    </div>
                    <div className="image-details">
                      <div className="image-name">{image.name}</div>
                      <div className="image-actions">
                        <button
                          className="copy-button"
                          onClick={() => copyImageUrl(image.url)}
                        >
                          Copy URL
                        </button>
                        <button
                          className="insert-button"
                          onClick={() => insertImageUrl(image.url)}
                        >
                          Insert
                        </button>
                        <button
                          className="delete-button small"
                          onClick={() => handleDeleteImage(image.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="image-usage-info">
              <h4>Using Images in Markdown</h4>
              <p>To add an image to your content, use the following markdown syntax:</p>
              <pre>![Alt text](/path/to/image.jpg)</pre>
              <p>You can copy image URLs from the list above, or click "Insert" to add them directly to your content.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;