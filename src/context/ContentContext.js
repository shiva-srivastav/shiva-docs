// src/context/ContentContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Initial sidebar data
const initialSidebarData = [
  {
    name: 'Home',
    slug: 'home',
    items: []
  },
  {
    name: 'Basics',
    slug: 'basics',
    items: [
      { name: 'Getting Started', slug: 'getting-started' },
      { name: 'Installation', slug: 'installation' },
      { name: 'Configuration', slug: 'configuration' },
      { name: 'User Guide', slug: 'user-guide' } // Add this line
    ]
  },
  {
    name: 'Tutorials',
    slug: 'tutorials',
    items: [
      { name: 'First Project', slug: 'first-project' },
      { name: 'Advanced Techniques', slug: 'advanced-techniques' }
    ]
  },
  {
    name: 'API',
    slug: 'api',
    items: [
      { name: 'Overview', slug: 'overview' },
      { name: 'Authentication', slug: 'authentication' },
      { name: 'Endpoints', slug: 'endpoints' }
    ]
  }
];

// Create the content context
export const ContentContext = createContext();

// Create a provider component
export const ContentProvider = ({ children }) => {
  const [sidebarData, setSidebarData] = useState(initialSidebarData);
  const [contentMap, setContentMap] = useState({});
  
  // Load initial content
  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For now, we'll populate the contentMap with some sample content
    
    const initialContent = {
      'basics/getting-started': `# Getting Started with Shiva

Welcome to Shiva documentation! This guide will help you get started with our platform.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v14 or later)
- npm or yarn
- Git

## Installation

You can install Shiva using npm:

\`\`\`bash
npm install shiva-platform
\`\`\`

## Basic Usage

Here's a simple example to get you started:

\`\`\`javascript
import { Shiva } from 'shiva-platform';

const app = new Shiva();
app.start();
\`\`\`

![Shiva Architecture](/content/images/shiva-architecture.png)

## Next Steps

Check out the [Configuration](/basics/configuration) guide to learn how to customize Shiva for your needs.`,
      
      'basics/installation': `# Installation Guide

This guide will walk you through the installation process for Shiva.

## System Requirements

- Operating System: Windows 10+, macOS 10.15+, or Linux
- CPU: 2+ cores
- RAM: 4GB minimum, 8GB recommended
- Disk Space: 500MB free space

## Installation Steps

### Using npm

\`\`\`bash
npm install shiva-platform --save
\`\`\`

### Using yarn

\`\`\`bash
yarn add shiva-platform
\`\`\`

## Verifying Installation

To verify that Shiva is installed correctly, run:

\`\`\`bash
npx shiva --version
\`\`\`

You should see the installed version number.`,
      
      // Add more content as needed
    };
    
    setContentMap(initialContent);
  }, []);
  
  // Function to add new content
  const addContent = (newContentData) => {
    const { category, title, slug, content } = newContentData;
    
    // Add content to the contentMap
    setContentMap(prevContentMap => ({
      ...prevContentMap,
      [`${category}/${slug}`]: content
    }));
    
    // Update the sidebar data
    setSidebarData(prevSidebarData => {
      const updatedSidebarData = [...prevSidebarData];
      
      // Find the category
      const categoryIndex = updatedSidebarData.findIndex(item => item.slug === category);
      
      if (categoryIndex !== -1) {
        // Category exists, add the new item
        const updatedCategory = {
          ...updatedSidebarData[categoryIndex],
          items: [
            ...updatedSidebarData[categoryIndex].items,
            { name: title, slug: slug }
          ]
        };
        
        updatedSidebarData[categoryIndex] = updatedCategory;
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
  };
  
  // Function to get content
  const getContent = (category, slug) => {
    return contentMap[`${category}/${slug}`] || null;
  };
  
  // Provide the context value
  const contextValue = {
    sidebarData,
    addContent,
    getContent
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