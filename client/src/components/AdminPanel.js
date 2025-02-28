// src/components/AdminPanel.js
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    getContent 
  } = useContent();
  
  // Get URL search params for editing
  const [searchParams] = useSearchParams();
  const editCategory = searchParams.get('category');
  const editSlug = searchParams.get('slug');
  
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
  
  // State to track if we're in edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // References
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  // Load content for editing when URL parameters are present
  useEffect(() => {
    if (editCategory && editSlug) {
      // Set active tab to content
      setActiveTab('content');
      setIsEditing(true);
      
      // Get the content to edit
      const contentToEdit = getContent(editCategory, editSlug);
      
      if (contentToEdit) {
        // Find the content details from sidebar data
        const categoryData = sidebarData.find(cat => cat.slug === editCategory);
        if (categoryData) {
          const contentItem = categoryData.items.find(item => item.slug === editSlug);
          if (contentItem) {
            // Set form fields with existing content
            setSelectedCategory(editCategory);
            setTitle(contentItem.name);
            setSlug(editSlug);
            setMarkdownContent(contentToEdit);
            
            // Show message to the user
            setContentMessage({ 
              text: `Editing "${contentItem.name}"`, 
              type: 'info' 
            });
          }
        }
      } else {
        setContentMessage({ 
          text: `Could not find content to edit`, 
          type: 'error' 
        });
      }
    } else {
      setIsEditing(false);
    }
  }, [editCategory, editSlug, sidebarData, getContent]);
  
  // Load images when the images tab is activated
  useEffect(() => {
    if (activeTab === 'images') {
      loadImages();
    }
  }, [activeTab]);
  
  // Format file size in a human-readable way
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
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
  
  // Handle adding/updating content
  const handleAddContent = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory || !title || !slug || !markdownContent) {
      setContentMessage({ text: 'All fields are required', type: 'error' });
      return;
    }
    
    setContentMessage({ text: isEditing ? 'Updating content...' : 'Saving content...', type: 'info' });
    
    const success = await addContent({
      category: selectedCategory,
      title,
      slug,
      content: markdownContent
    });
    
    if (success) {
      setContentMessage({ 
        text: isEditing 
          ? `Content "${title}" updated successfully` 
          : `Content "${title}" saved successfully`, 
        type: 'success' 
      });
      
      // If we're editing and changed the category or slug, clear URL params
      if (isEditing && (editCategory !== selectedCategory || editSlug !== slug)) {
        // Remove the search params to avoid confusion on future edits
        window.history.replaceState({}, '', '/admin');
        setIsEditing(false);
      }
      
      // Optional: reset form fields after creating new content
      if (!isEditing) {
        // setTitle('');
        // setSlug('');
        // setMarkdownContent('');
        // setUploadedFile(null);
      }
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
  
  // Load images
  const loadImages = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const API_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/admin/images`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.images && Array.isArray(data.images)) {
          setUploadedImages(data.images);
        }
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImage(true);
    setImageMessage({ text: 'Uploading images...', type: 'info' });
    
    const uploadedFiles = [];
    const API_URL = 'http://localhost:5000/api';
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.startsWith('image/')) {
          continue;
        }
        
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setImageMessage({ 
            text: 'Authentication required. Please log in.', 
            type: 'error' 
          });
          setUploadingImage(false);
          return;
        }
        
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`${API_URL}/admin/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`  // Add authentication header
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          uploadedFiles.push({
            name: file.name,
            url: data.url,
            size: file.size
          });
        }
      }
      
      if (uploadedFiles.length > 0) {
        setUploadedImages([...uploadedImages, ...uploadedFiles]);
        setImageMessage({ 
          text: `Successfully uploaded ${uploadedFiles.length} image(s)`, 
          type: 'success' 
        });
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
      // Clear the file input so the same file can be selected again
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };
  
  // Copy image URL or filename to clipboard
  const copyImageUrl = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setImageMessage({ text: 'Copied to clipboard', type: 'success' });
      setTimeout(() => setImageMessage({ text: '', type: '' }), 3000);
    });
  };
  
  // Insert image URL into markdown content
  const insertImageMarkdown = (filename) => {
    const imageMarkdown = `![Image description](${filename})`;
    
    // Insert at cursor position or at the end
    setMarkdownContent(prevContent => {
      if (!prevContent) return imageMarkdown;
      
      // If we're in the content tab, insert at current position
      if (activeTab === 'content') {
        const textarea = document.getElementById('content');
        if (textarea) {
          const cursorPos = textarea.selectionStart;
          return prevContent.substring(0, cursorPos) + 
                 '\n\n' + imageMarkdown + '\n\n' + 
                 prevContent.substring(cursorPos);
        }
      }
      
      // Otherwise, append to the end
      return prevContent + '\n\n' + imageMarkdown;
    });
    
    // Switch to content tab to show the inserted image code
    setActiveTab('content');
    
    setImageMessage({ text: 'Image markdown inserted in editor', type: 'success' });
  };
  
  // Delete an image
  const deleteImage = async (filename) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return false;
      
      const API_URL = 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/admin/images/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Remove the image from the list
        setUploadedImages(images => images.filter(img => !img.url.includes(filename)));
        setImageMessage({ text: 'Image deleted successfully', type: 'success' });
        return true;
      } else {
        setImageMessage({ text: 'Failed to delete image', type: 'error' });
        return false;
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setImageMessage({ text: 'Error deleting image', type: 'error' });
      return false;
    }
  };
  
  // Refresh all content from server
  const handleRefresh = async () => {
    await refreshContent();
    setContentMessage({ text: 'Content refreshed from server', type: 'success' });
  };
  
  // Reset the edit form
  const handleCancelEdit = () => {
    // Clear form fields
    setTitle('');
    setSlug('');
    setMarkdownContent('');
    setSelectedCategory('');
    setUploadedFile(null);
    
    // Clear URL params
    window.history.replaceState({}, '', '/admin');
    
    // Reset edit state
    setIsEditing(false);
    
    // Clear message
    setContentMessage({ text: '', type: '' });
  };
  
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
          <h2>{isEditing ? 'Edit Content' : 'Add Content'}</h2>
          
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
              <button type="submit" className="submit-button">
                {isEditing ? 'Update Content' : 'Save Content'}
              </button>
              
              {isEditing && (
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleCancelEdit}
                >
                  Cancel Editing
                </button>
              )}
              
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
              <li><code>![Alt text](image-filename.jpg)</code> - Image</li>
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
                      onClick={async () => {
                        if (window.confirm(`Are you sure you want to delete the "${category.name}" category and all its content?`)) {
                          const success = await deleteCategory(category.slug);
                          if (success) {
                            setCategoryMessage({ 
                              text: `Category "${category.name}" deleted successfully`, 
                              type: 'success' 
                            });
                          } else {
                            setCategoryMessage({ 
                              text: `Failed to delete category "${category.name}"`, 
                              type: 'error' 
                            });
                          }
                        }
                      }}
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
            
            <button 
              type="button" 
              className="refresh-button"
              onClick={loadImages}
              disabled={uploadingImage}
            >
              Refresh Image List
            </button>
          </div>
          
          <div className="uploaded-images">
            <h3>Uploaded Images</h3>
            {uploadedImages.length === 0 ? (
              <p>No images uploaded yet.</p>
            ) : (
              <div className="image-grid">
                {uploadedImages.map((image, index) => {
                  // Extract just the filename from the full path
                  const filename = image.url.split('/').pop();
                  
                  return (
                    <div key={index} className="image-item">
                      <div className="image-preview">
                        <img src={image.url} alt={image.name || filename} />
                      </div>
                      <div className="image-details">
                        <div className="image-name" title={filename}>{filename}</div>
                        <div className="image-size">{formatFileSize(image.size)}</div>
                        <div className="image-actions">
                          <button
                            className="copy-button"
                            onClick={() => copyImageUrl(filename)}
                            title="Copy just the filename for markdown use"
                          >
                            Copy Name
                          </button>
                          <button
                            className="insert-button"
                            onClick={() => insertImageMarkdown(filename)}
                            title="Insert markdown image code in the editor"
                          >
                            Insert in Editor
                          </button>
                          <button
                            className="delete-button small"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this image?')) {
                                deleteImage(filename);
                              }
                            }}
                            title="Delete this image"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="image-usage-info">
              <h4>Using Images in Markdown</h4>
              <p>To add an image to your content, use the following markdown syntax:</p>
              <pre>![Alt text](filename.jpg)</pre>
              <p>You can copy image filenames from the list above, or click "Insert in Editor" to add them directly to your content.</p>
              
              <h4>Advanced Image Formatting</h4>
              <p>You can use special modifiers with your images:</p>
              <ul>
                <li><code>![Alt text](image.jpg#center)</code> - Center the image</li>
                <li><code>![Alt text](image.jpg#small)</code> - Display as a smaller image</li>
                <li><code>![Alt text](image.jpg "Caption text")</code> - Add a caption</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;