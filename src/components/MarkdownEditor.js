// src/components/MarkdownEditor.js
import React, { useState } from 'react';
import '../styles/MarkdownEditor.css';

const MarkdownEditor = ({ initialValue = '', onSave }) => {
  const [content, setContent] = useState(initialValue);
  
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
  };
  
  const insertMarkdown = (template) => {
    // Get cursor position
    const textarea = document.getElementById('markdown-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Insert template at cursor position
    const newContent = content.substring(0, start) + template + content.substring(end);
    setContent(newContent);
    
    // Move cursor to appropriate position
    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + template.indexOf('|');
      if (cursorPosition > start) {
        // Template has a cursor placeholder
        textarea.selectionStart = cursorPosition;
        textarea.selectionEnd = cursorPosition;
        
        // Remove the placeholder
        const finalContent = newContent.replace('|', '');
        setContent(finalContent);
      } else {
        // No placeholder, move to the end of the inserted template
        textarea.selectionStart = start + template.length;
        textarea.selectionEnd = start + template.length;
      }
    }, 0);
  };
  
  const toolbar = [
    { name: 'h1', label: 'H1', template: '# |Heading 1\n\n' },
    { name: 'h2', label: 'H2', template: '## |Heading 2\n\n' },
    { name: 'h3', label: 'H3', template: '### |Heading 3\n\n' },
    { name: 'bold', label: 'B', template: '**|bold text**' },
    { name: 'italic', label: 'I', template: '*|italic text*' },
    { name: 'link', label: '🔗', template: '[|link text](url)' },
    { name: 'image', label: '🖼️', template: '![|alt text](image-url)' },
    { name: 'code', label: '<>', template: '```\n|code here\n```' },
    { name: 'list', label: '•', template: '- |Item 1\n- Item 2\n- Item 3\n\n' },
    { name: 'table', label: '☰', template: '| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |\n\n' },
  ];
  
  return (
    <div className="markdown-editor-container">
      <div className="editor-toolbar">
        {toolbar.map((item) => (
          <button
            key={item.name}
            className="toolbar-button"
            onClick={() => insertMarkdown(item.template)}
            title={item.name}
          >
            {item.label}
          </button>
        ))}
      </div>
      <textarea
        id="markdown-editor"
        className="markdown-editor-textarea"
        value={content}
        onChange={handleChange}
        placeholder="Write your markdown content here..."
      />
      <div className="editor-actions">
        <button className="save-button" onClick={handleSave}>
          Save Content
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditor;