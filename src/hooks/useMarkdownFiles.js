// src/hooks/useMarkdownFiles.js
import { useState, useEffect } from 'react';

export const useMarkdownFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to scan directories and find markdown files
  const scanForMarkdownFiles = async () => {
    try {
      setLoading(true);
      
      // In a real application, you would make an API call to your server
      // to get the list of available markdown files
      
      // For this demo, we'll use a hardcoded list
      const mockFiles = [
        { category: 'basics', name: 'Getting Started', slug: 'getting-started' },
        { category: 'basics', name: 'Installation', slug: 'installation' },
        { category: 'basics', name: 'Configuration', slug: 'configuration' },
        { category: 'tutorials', name: 'First Project', slug: 'first-project' },
        { category: 'tutorials', name: 'Advanced Techniques', slug: 'advanced-techniques' },
        { category: 'api', name: 'Overview', slug: 'overview' },
        { category: 'api', name: 'Authentication', slug: 'authentication' },
        { category: 'api', name: 'Endpoints', slug: 'endpoints' },
      ];
      
      setFiles(mockFiles);
      setError(null);
    } catch (err) {
      console.error('Error scanning for markdown files:', err);
      setError('Failed to load markdown files');
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new markdown file
  const addMarkdownFile = async (category, title, slug, content) => {
    try {
      // In a real application, you would make an API call to save the file
      
      // For this demo, we'll just add it to our local state
      setFiles(prevFiles => [
        ...prevFiles,
        { category, name: title, slug }
      ]);
      
      return true;
    } catch (err) {
      console.error('Error adding markdown file:', err);
      setError('Failed to add markdown file');
      return false;
    }
  };

  // Initialize the list of files
  useEffect(() => {
    scanForMarkdownFiles();
  }, []);

  return {
    files,
    loading,
    error,
    scanForMarkdownFiles,
    addMarkdownFile
  };
};