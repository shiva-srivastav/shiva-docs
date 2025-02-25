// src/components/CodeBlock.js
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Changed github to vs which is available

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
  
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
        className="copy-button" 
        onClick={handleCopy}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default CodeBlock;