// src/components/MarkdownRenderer.js
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';
import '../styles/MarkdownRenderer.css';

const MarkdownRenderer = ({ markdown }) => {
  // Convert heading text to a valid ID format
  const createId = (text) => {
    if (typeof text !== 'string') {
      if (Array.isArray(text)) {
        text = text.join('');
      } else {
        return '';
      }
    }
    
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  };

  // Add IDs to headings after rendering
  useEffect(() => {
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    headings.forEach(heading => {
      if (!heading.id) {
        heading.id = createId(heading.textContent);
      }
    });
    
    // Handle hash navigation on load
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [markdown]);

  return (
    <div className="markdown-renderer">
      <div className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ node, children, ...props }) => {
              const id = createId(children);
              return <h1 id={id} {...props}>{children}</h1>;
            },
            h2: ({ node, children, ...props }) => {
              const id = createId(children);
              return <h2 id={id} {...props}>{children}</h2>;
            },
            h3: ({ node, children, ...props }) => {
              const id = createId(children);
              return <h3 id={id} {...props}>{children}</h3>;
            },
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
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRenderer;