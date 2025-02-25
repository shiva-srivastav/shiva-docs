// src/components/MarkdownRenderer.js (updated)
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import 'github-markdown-css/github-markdown.css';
import '../styles/Markdownrenderer.css';

const MarkdownRenderer = ({ markdown }) => {
  return (
    <div className="markdown-renderer">
      <div className="markdown-body">
        <ReactMarkdown
          children={markdown}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code: ({ node, inline, className, children, ...props }) => {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <CodeBlock 
                  language={match[1]} 
                  value={String(children).replace(/\n$/, '')} 
                  {...props} 
                />
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            img: ({ node, ...props }) => (
              <img className="markdown-image" {...props} alt={props.alt || ''} />
            ),
          }}
        />
      </div>
    </div>
  );
};

export default MarkdownRenderer;