// src/components/CodeBlock.js
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/CodeBlock.css';

const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Determine if we're in dark mode
  const isDarkMode = document.documentElement.classList.contains('dark-theme');
  const style = isDarkMode ? tomorrow : vs;

  return (
    <div className="code-block-wrapper">
      <SyntaxHighlighter 
        language={language} 
        style={style}
        showLineNumbers={true}
        wrapLines={true}
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