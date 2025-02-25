// src/components/AdminPage.js (complete code)
import React, { useState } from 'react';
import FileManager from './FileManager';
import MarkdownEditor from './MarkdownEditor';
import ImageUploader from './ImageUploader';
import { useContent } from '../context/ContentContext';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const { addContent } = useContent();
  const [activeTab, setActiveTab] = useState('documents');
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [editorMetadata, setEditorMetadata] = useState({
    category: '',
    title: '',
    slug: ''
  });
  // eslint-disable-next-line
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileAdded = (fileData) => {
    addContent(fileData);
  };

  const handleCreateNew = () => {
    setEditorContent('# New Document\n\nStart writing your content here...');
    setEditorMetadata({
      category: '',
      title: '',
      slug: ''
    });
    setShowEditor(true);
  };

  const handleSaveContent = (content) => {
    if (!editorMetadata.category || !editorMetadata.title || !editorMetadata.slug) {
      alert('Please fill in all metadata fields');
      return;
    }
    
    addContent({
      category: editorMetadata.category,
      title: editorMetadata.title,
      slug: editorMetadata.slug,
      content: content
    });
    
    setShowEditor(false);
    setEditorContent('');
    setEditorMetadata({
      category: '',
      title: '',
      slug: ''
    });
  };

  const handleImageUploaded = (images) => {
    setUploadedImages(prev => [...prev, ...images]);
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p>Use this dashboard to manage your documentation content.</p>
      
      {!showEditor ? (
        <>
          <div className="admin-tabs">
            <button 
              className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button 
              className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
              onClick={() => setActiveTab('images')}
            >
              Images
            </button>
          </div>
          
          {activeTab === 'documents' ? (
            <>
              <div className="admin-actions">
                <button className="create-new-button" onClick={handleCreateNew}>
                  Create New Document
                </button>
              </div>
              
              <FileManager onFileAdded={handleFileAdded} />
              
              <div className="additional-info">
                <h2>How to Format Your Markdown</h2>
                <p>
                  Our documentation supports standard Markdown syntax along with some additional features:
                </p>
                <ul>
                  <li>Use # for headings (# for h1, ## for h2, etc.)</li>
                  <li>Images should be placed in the /content/images/ directory</li>
                  <li>Reference images with ![Alt text](/content/images/your-image.png)</li>
                  <li>Code blocks should use triple backticks with the language specified</li>
                </ul>
              </div>
            </>
          ) : (
            <ImageUploader onImageUploaded={handleImageUploaded} />
          )}
        </>
      ) : (
        <div className="editor-panel">
          <h2>Create New Document</h2>
          
          <div className="metadata-form">
            <div className="form-group">
              <label htmlFor="editor-category">Category:</label>
              <select
                id="editor-category"
                value={editorMetadata.category}
                onChange={(e) => setEditorMetadata({...editorMetadata, category: e.target.value})}
                required
              >
                <option value="">Select a category</option>
                <option value="basics">Basics</option>
                <option value="spring">spring</option>
                <option value="tutorials">Tutorials</option>
                <option value="api">API</option>
                <option value="advanced">Advanced</option>
               
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="editor-title">Title:</label>
              <input
                type="text"
                id="editor-title"
                value={editorMetadata.title}
                onChange={(e) => setEditorMetadata({
                  ...editorMetadata, 
                  title: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                })}
                placeholder="Document Title"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="editor-slug">Slug (URL):</label>
              <input
                type="text"
                id="editor-slug"
                value={editorMetadata.slug}
                onChange={(e) => setEditorMetadata({...editorMetadata, slug: e.target.value})}
                placeholder="document-slug"
                required
              />
            </div>
          </div>
          
          <MarkdownEditor 
            initialValue={editorContent} 
            onSave={handleSaveContent} 
          />
          
          <div className="editor-bottom-actions">
            <button 
              className="cancel-button" 
              onClick={() => setShowEditor(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;