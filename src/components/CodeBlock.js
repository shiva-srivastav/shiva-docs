// src/components/CodeBlock.js
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/CodeBlock.css';

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for dark mode on component mount and when theme changes
  useEffect(() => {
    // Initial check
    setIsDarkMode(document.documentElement.classList.contains('dark-theme'));
    
    // Create a mutation observer to watch for class changes on the document element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark-theme'));
        }
      });
    });
    
    // Start observing
    observer.observe(document.documentElement, { attributes: true });
    
    // Clean up
    return () => observer.disconnect();
  }, []);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };
  
  return (
    <div className="code-block-wrapper">
      <SyntaxHighlighter 
        language={language || 'text'} 
        style={isDarkMode ? tomorrow : vs}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          margin: 0,
          padding: '1em',
          borderRadius: '6px',
          backgroundColor: isDarkMode ? '#1e1e1e' : '#f6f8fa'
        }}
      >
        {value}
      </SyntaxHighlighter>
      <button 
        className={`copy-button ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
      >
        {copied ? (
          <>
            <CopiedIcon /> Copied!
          </>
        ) : (
          <>
            <CopyIcon /> Copy
          </>
        )}
      </button>
    </div>
  );
};

// Copy icon component
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

// Copied icon component
const CopiedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default CodeBlock;