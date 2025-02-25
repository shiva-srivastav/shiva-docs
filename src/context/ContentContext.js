// src/context/ContentContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// API URL - adjust if needed
const API_URL = 'http://localhost:5000/api';

// Create the content context
export const ContentContext = createContext();

// Create a provider component
export const ContentProvider = ({ children }) => {
  const [sidebarData, setSidebarData] = useState([]);
  const [contentMap, setContentMap] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Load content structure from server
  useEffect(() => {
    const fetchContentStructure = async () => {
      try {
        setLoading(true);
        
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
    
    fetchContentStructure();
  }, []);
  
  // Function to add new content
  const addContent = async (newContentData) => {
    const { category, title, slug, content } = newContentData;
    
    try {
      // Send the content to the server
      const response = await fetch(`${API_URL}/admin/content/${category}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
              ]
            };
            
            updatedSidebarData[categoryIndex] = updatedCategory;
          } else {
            // Item exists, update its name if needed
            if (updatedSidebarData[categoryIndex].items[itemIndex].name !== title) {
              updatedSidebarData[categoryIndex].items[itemIndex].name = title;
            }
          }
        } else {
          // Category doesn't exist, create a new one
          updatedSidebarData.push({
            name: category.charAt(0).toUpperCase() + category.slice(1),
            slug: category,
            items: [{ name: title, slug: slug }]
          });
        }
        
        return updatedSidebarData;
      });
      
      return true;
    } catch (error) {
      console.error('Error adding content:', error);
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
      const response = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      
      const newCategory = await response.json();
      
      // Update sidebar data
      setSidebarData(prev => [
        ...prev,
        {
          name: newCategory.name,
          slug: newCategory.slug,
          items: []
        }
      ]);
      
      return true;
    } catch (error) {
      console.error('Error creating category:', error);
      return false;
    }
  };
  
  // Function to delete content
  const deleteContent = async (category, slug) => {
    try {
      const response = await fetch(`${API_URL}/admin/content/${category}/${slug}`, {
        method: 'DELETE',
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
      return false;
    }
  };
  
  // Function to delete a category
  const deleteCategory = async (category) => {
    try {
      const response = await fetch(`${API_URL}/admin/categories/${category}`, {
        method: 'DELETE',
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
      return false;
    }
  };
  
  // Reload content from the server
  const refreshContent = async () => {
    setLoading(true);
    try {
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
      console.error('Error refreshing content:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Provide the context value
  const contextValue = {
    sidebarData,
    loading,
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