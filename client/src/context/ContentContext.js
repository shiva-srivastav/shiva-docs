// src/context/ContentContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

// API URL - adjust if needed
// const API_URL = 'http://localhost:5000/api';
const API_URL = process.env.REACT_APP_SERVER_API + '/api';
console.log(API_URL);
// Create the content context
export const ContentContext = createContext();

// Create a provider component
export const ContentProvider = ({ children }) => {
  const [sidebarData, setSidebarData] = useState([]);
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Add error state
  
  // Get auth headers from AuthContext
  // Always call the hook, but handle the case where it might not be available yet
  const auth = useAuth();
  const getAuthHeader = auth ? auth.getAuthHeader : () => ({});
  
  // Refactor the fetch content structure into a named function to reuse it
  const fetchContentStructure = async () => {
    try {
      setLoading(true);
      setError(null);  // Clear any previous errors
      
      // Fetch categories and content structure
      const response = await fetch(`${API_URL}/categories`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const categories = await response.json();
      
      if (Array.isArray(categories)) {
        setSidebarData(categories);
        
        // Pre-load the content for each file
        const newContentMap = {};
        
        for (const category of categories) {
          if (category.items && category.items.length > 0) {
            for (const item of category.items) {
              try {
                const contentResponse = await fetch(`${API_URL}/content/${category.slug}/${item.slug}`);
                if (contentResponse.ok) {
                  const text = await contentResponse.text();
                  newContentMap[`${category.slug}/${item.slug}`] = text;
                }
              } catch (error) {
                console.warn(`Could not load content for ${category.slug}/${item.slug}`, error);
              }
            }
          }
        }
        
        setContentMap(newContentMap);
      }
    } catch (error) {
      console.error('Error fetching content structure:', error);
      setError('Failed to load content');  // Set error message
      
      // Set a minimal fallback structure
      setSidebarData([
        {
          name: 'Basics',
          slug: 'basics',
          items: [
            { name: 'Getting Started', slug: 'getting-started' }
          ]
        }
      ]);
      setContentMap({
        'basics/getting-started': '# Getting Started\n\nWelcome to Shiva documentation!'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load content structure from server
  useEffect(() => {
    fetchContentStructure();
  }, []);
  
  // Function to add new content or update existing content
  const addContent = async (newContentData) => {
    const { category, title, slug, content } = newContentData;
    
    try {
      setError(null);  // Clear any previous errors
      
      // Send the content to the server with auth headers
      const response = await fetch(`${API_URL}/admin/content/${category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()  // Add auth headers
        },
        body: JSON.stringify({ title, slug, content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save content');
      }
      
      // Update the local state
      setContentMap(prevContentMap => ({
        ...prevContentMap,
        [`${category}/${slug}`]: content
      }));
      
      // eslint-disable-next-line no-unused-vars
      const isEditing = sidebarData.some(
        c => c.slug === category && c.items && c.items.some(i => i.slug === slug)
      );
      
      // Update the sidebar data if needed
      setSidebarData(prevSidebarData => {
        const updatedSidebarData = [...prevSidebarData];
        
        // Find the category
        const categoryIndex = updatedSidebarData.findIndex(item => item.slug === category);
        
        if (categoryIndex !== -1) {
          // Check if item already exists
          const itemIndex = updatedSidebarData[categoryIndex].items.findIndex(item => item.slug === slug);
          
          if (itemIndex === -1) {
            // Item doesn't exist, add it
            const updatedCategory = {
              ...updatedSidebarData[categoryIndex],
              items: [
                ...updatedSidebarData[categoryIndex].items,
                { name: title, slug: slug }
              ].sort((a, b) => a.name.localeCompare(b.name))  // Sort items alphabetically
            };
            
            updatedSidebarData[categoryIndex] = updatedCategory;
          } else {
            // Item exists, update its name if needed
            if (updatedSidebarData[categoryIndex].items[itemIndex].name !== title) {
              updatedSidebarData[categoryIndex].items[itemIndex].name = title;
              
              // Re-sort the items if the name changed
              updatedSidebarData[categoryIndex].items.sort((a, b) => 
                a.name.localeCompare(b.name)
              );
            }
          }
        } else {
          // Category doesn't exist, create a new one
          updatedSidebarData.push({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            slug: category,
            items: [{ name: title, slug: slug }]
          });
          
          // Sort categories alphabetically
          updatedSidebarData.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        return updatedSidebarData;
      });
      
      return true;
    } catch (error) {
      console.error('Error adding content:', error);
      setError('Failed to save content');  // Set error message
      return false;
    }
  };
  
  // Function to get content
  const getContent = (category, slug) => {
    return contentMap[`${category}/${slug}`] || null;
  };
  
  // Function to create a new category
  const createCategory = async (name) => {
    try {
      setError(null);  // Clear any previous errors
      
      const response = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()  // Add auth headers
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      
      const newCategory = await response.json();
      
      // Update sidebar data
      setSidebarData(prev => {
        const updated = [
          ...prev,
          {
            name: newCategory.name,
            slug: newCategory.slug,
            items: []
          }
        ];
        
        // Sort categories alphabetically
        return updated.sort((a, b) => a.name.localeCompare(b.name));
      });
      
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category');  // Set error message
      return false;
    }
  };
  
  // Function to delete content
  const deleteContent = async (category, slug) => {
    try {
      setError(null);  // Clear any previous errors
      
      const response = await fetch(`${API_URL}/admin/content/${category}/${slug}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader()  // Add auth headers
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete content');
      }
      
      // Update the content map
      setContentMap(prevContentMap => {
        const newContentMap = { ...prevContentMap };
        delete newContentMap[`${category}/${slug}`];
        return newContentMap;
      });
      
      // Update the sidebar data
      setSidebarData(prevSidebarData => {
        const updatedSidebarData = [...prevSidebarData];
        
        // Find the category
        const categoryIndex = updatedSidebarData.findIndex(item => item.slug === category);
        
        if (categoryIndex !== -1) {
          // Remove the item from the category
          updatedSidebarData[categoryIndex] = {
            ...updatedSidebarData[categoryIndex],
            items: updatedSidebarData[categoryIndex].items.filter(item => item.slug !== slug)
          };
        }
        
        return updatedSidebarData;
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      setError('Failed to delete content');  // Set error message
      return false;
    }
  };
  
  // Function to delete a category
  const deleteCategory = async (category) => {
    try {
      setError(null);  // Clear any previous errors
      
      const response = await fetch(`${API_URL}/admin/categories/${category}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader()  // Add auth headers
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      // Update the sidebar data
      setSidebarData(prevSidebarData =>
        prevSidebarData.filter(item => item.slug !== category)
      );
      
      // Remove content for this category from the content map
      setContentMap(prevContentMap => {
        const newContentMap = { ...prevContentMap };
        
        // Remove all entries that start with this category
        Object.keys(newContentMap).forEach(key => {
          if (key.startsWith(`${category}/`)) {
            delete newContentMap[key];
          }
        });
        
        return newContentMap;
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');  // Set error message
      return false;
    }
  };
  
  // Reload content from the server
  const refreshContent = async () => {
    setLoading(true);
    setError(null);  // Clear any previous errors
    
    try {
      await fetchContentStructure();
      return true;
    } catch (error) {
      console.error('Error refreshing content:', error);
      setError('Failed to refresh content');  // Set error message
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Provide the context value
  const contextValue = {
    sidebarData,
    loading,
    error,  // Expose error state to consumers
    addContent,
    getContent,
    createCategory,
    deleteContent,
    deleteCategory,
    refreshContent
  };
  
  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
};

// Custom hook to use the content context
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export default ContentProvider;
