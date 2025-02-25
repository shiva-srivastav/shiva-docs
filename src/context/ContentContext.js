// src/context/ContentContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the content context
export const ContentContext = createContext();

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
      { name: 'User Guide', slug: 'user-guide' }
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

// Create a provider component
export const ContentProvider = ({ children }) => {
  const [sidebarData, setSidebarData] = useState(initialSidebarData);
  const [contentMap, setContentMap] = useState({});
  
  // Load initial content
  useEffect(() => {
    // In a real application, you would fetch this data from your API
    // For now, we'll populate the contentMap with hardcoded content
    
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
      
      'basics/configuration': `# Configuration Guide

Learn how to configure Shiva for your specific needs.

## Configuration File

Shiva uses a configuration file named \`shiva.config.js\` in the root of your project.

\`\`\`javascript
// shiva.config.js
module.exports = {
  port: 3000,
  debug: true,
  database: {
    url: 'mongodb://localhost:27017/shiva'
  },
  logging: {
    level: 'info'
  }
};
\`\`\`

## Environment Variables

You can also configure Shiva using environment variables:

\`\`\`bash
SHIVA_PORT=3000
SHIVA_DEBUG=true
SHIVA_DB_URL=mongodb://localhost:27017/shiva
\`\`\`

## Advanced Configuration

For advanced configuration options, refer to our [API documentation](/api/overview).`,
      
      'basics/user-guide': `# User Guide

This comprehensive guide will help you use all features of Shiva effectively.

## Basic Concepts

Before diving into details, it's important to understand the key concepts behind Shiva:

- **Projects**: Containers for your work
- **Components**: Reusable building blocks
- **Services**: Backend functionality

## Working with Projects

### Creating a Project

\`\`\`bash
shiva new my-project
cd my-project
\`\`\`

### Running Your Project

\`\`\`bash
shiva start
\`\`\`

## Component Development

Components in Shiva follow a simple structure:

\`\`\`javascript
import { Component } from 'shiva';

class MyComponent extends Component {
  render() {
    return '<div>Hello World</div>';
  }
}

export default MyComponent;
\`\`\`

## Troubleshooting

Common issues and their solutions:

1. **Connection errors**: Check your network and firewall settings
2. **Missing dependencies**: Run \`npm install\` to update dependencies
3. **Build failures**: Clear the cache with \`shiva clean\``,
      
      'tutorials/first-project': `# Building Your First Project

This tutorial will guide you through creating your first Shiva project from start to finish.

## Setup

First, create a new project:

\`\`\`bash
npx shiva-cli new my-first-project
cd my-first-project
\`\`\`

## Project Structure

Your new project has the following structure:

\`\`\`
my-first-project/
├── src/
│   ├── components/
│   ├── services/
│   └── index.js
├── public/
├── shiva.config.js
└── package.json
\`\`\`

## Creating Your First Component

Create a file at \`src/components/Greeting.js\`:

\`\`\`javascript
import { Component } from 'shiva';

export default class Greeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'World'
    };
  }
  
  render() {
    return \`
      <div>
        <h1>Hello, \${this.state.name}!</h1>
        <input 
          type="text" 
          value="\${this.state.name}"
          onInput="this.setState({ name: event.target.value })"
        />
      </div>
    \`;
  }
}
\`\`\`

## Using Your Component

Update \`src/index.js\`:

\`\`\`javascript
import { Shiva } from 'shiva';
import Greeting from './components/Greeting';

const app = new Shiva();
app.component('greeting', Greeting);
app.start();
\`\`\`

## Running Your Project

\`\`\`bash
npm start
\`\`\`

Visit http://localhost:3000 to see your project in action!`,
      
      'tutorials/advanced-techniques': `# Advanced Techniques

This guide covers more advanced usage of Shiva.

## Custom Hooks

Shiva supports custom hooks for advanced state management:

\`\`\`javascript
import { createHook } from 'shiva';

function useCounter(initialValue = 0) {
  const [count, setCount] = createState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// Usage in a component
function CounterComponent() {
  const { count, increment, decrement } = useCounter(10);
  
  return \`
    <div>
      <p>Count: \${count}</p>
      <button onclick="\${increment}">+</button>
      <button onclick="\${decrement}">-</button>
    </div>
  \`;
}
\`\`\`

## Performance Optimization

### Memoization

Use memoization to prevent unnecessary re-renders:

\`\`\`javascript
import { memo } from 'shiva';

const ExpensiveComponent = memo(function ExpensiveComponent(props) {
  // This component only re-renders when props change
  return \`<div>\${heavyCalculation(props.data)}</div>\`;
});
\`\`\`

### Virtual DOM Diffing

Shiva uses a virtual DOM diffing algorithm to minimize real DOM operations:

\`\`\`javascript
import { createElement } from 'shiva';

function optimizedRender(data) {
  return createElement('div', { className: 'container' },
    createElement('h1', null, 'Title'),
    createElement('ul', null,
      data.map(item => createElement('li', { key: item.id }, item.text))
    )
  );
}
\`\`\`

## Integrating with Other Libraries

Shiva works well with most third-party libraries:

\`\`\`javascript
import { Component } from 'shiva';
import * as d3 from 'd3';

class D3Chart extends Component {
  componentDidMount() {
    const svg = d3.select(this.el)
      .append('svg')
      .attr('width', 600)
      .attr('height', 400);
      
    // Create D3 visualization
    svg.append('circle')
      .attr('cx', 300)
      .attr('cy', 200)
      .attr('r', 50)
      .attr('fill', 'blue');
  }
  
  render() {
    return '<div class="chart-container" ref="this.el"></div>';
  }
}
\`\`\``,
      
      'api/overview': `# API Overview

This page provides an overview of the Shiva API.

## Core Modules

Shiva consists of several core modules:

- **Core**: Base functionality and runtime
- **DOM**: DOM manipulation utilities
- **Component**: Component system
- **Router**: Client-side routing
- **State**: State management
- **Fetch**: Network request utilities

## Getting Started with the API

To use the Shiva API, first import the modules you need:

\`\`\`javascript
import { Core, Component, Router } from 'shiva';

// Initialize the core
const app = new Core({
  debug: true
});

// Create and register a component
app.register(new Component('greeting', {
  template: '<h1>Hello World</h1>'
}));

// Start the application
app.start();
\`\`\`

## API Versioning

Shiva follows semantic versioning (SemVer):

- Major version changes indicate breaking API changes
- Minor version changes add new features without breaking existing ones
- Patch version changes fix bugs and make minor improvements

The current stable API is v1.0.`,
      
      'api/authentication': `# Authentication API

Learn how to authenticate with the Shiva API.

## Authentication Methods

Shiva supports several authentication methods:

1. API Key
2. OAuth 2.0
3. JWT (JSON Web Tokens)

## API Key Authentication

The simplest way to authenticate is using an API key:

\`\`\`javascript
import { Api } from 'shiva';

const api = new Api({
  apiKey: 'your_api_key_here'
});

// Make authenticated requests
api.get('/protected-resource').then(response => {
  console.log(response.data);
});
\`\`\`

## OAuth 2.0 Authentication

For web applications, OAuth 2.0 is recommended:

\`\`\`javascript
import { Auth } from 'shiva';

const auth = new Auth({
  clientId: 'your_client_id',
  redirectUri: 'https://your-app.com/callback',
  scope: 'read write'
});

// Redirect user to login
auth.authorize();

// Handle callback
auth.handleCallback().then(credentials => {
  console.log('Access token:', credentials.accessToken);
});
\`\`\`

## JWT Authentication

For service-to-service communication, use JWT:

\`\`\`javascript
import { JWT } from 'shiva';

const jwt = new JWT({
  secret: 'your_secret_key'
});

const token = jwt.sign({ userId: 123 });

// Verify token
const payload = jwt.verify(token);
console.log(payload.userId); // 123
\`\`\``,
      
      'api/endpoints': `# API Endpoints

Complete reference for all Shiva API endpoints.

## Core Endpoints

### GET /api/status

Returns the current status of the API.

**Response:**

\`\`\`json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 3600
}
\`\`\`

### POST /api/projects

Creates a new project.

**Request:**

\`\`\`json
{
  "name": "My Project",
  "description": "A new Shiva project"
}
\`\`\`

**Response:**

\`\`\`json
{
  "id": "proj_123",
  "name": "My Project",
  "description": "A new Shiva project",
  "createdAt": "2023-01-01T00:00:00Z"
}
\`\`\`

## Component Endpoints

### GET /api/components

Returns a list of available components.

**Response:**

\`\`\`json
{
  "components": [
    {
      "id": "comp_123",
      "name": "Button",
      "version": "1.2.0"
    },
    {
      "id": "comp_124",
      "name": "Card",
      "version": "1.0.5"
    }
  ]
}
\`\`\`

### GET /api/components/:id

Returns details for a specific component.

**Response:**

\`\`\`json
{
  "id": "comp_123",
  "name": "Button",
  "version": "1.2.0",
  "description": "A customizable button component",
  "props": [
    {
      "name": "text",
      "type": "string",
      "required": true
    },
    {
      "name": "color",
      "type": "string",
      "default": "blue"
    }
  ]
}
\`\`\`

## Error Codes

Common error codes and their meanings:

- **400** - Bad Request: Invalid input parameters
- **401** - Unauthorized: Authentication required
- **403** - Forbidden: Insufficient permissions
- **404** - Not Found: Resource doesn't exist
- **429** - Too Many Requests: Rate limit exceeded
- **500** - Internal Server Error: Server-side issue`
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