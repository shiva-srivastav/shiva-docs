// src/components/CodeBlock.js
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ language, value }) => {
  return (
    <SyntaxHighlighter 
      language={language} 
      style={tomorrow}
      showLineNumbers={true}
      wrapLines={true}
    >
      {value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;