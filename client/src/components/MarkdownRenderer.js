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
    
    // Clean the text of any markdown formatting
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic
      .replace(/`(.*?)`/g, '$1')       // Remove code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .trim();
    
    return cleanText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  };

  // Add IDs to headings after rendering and implement smooth scrolling
  useEffect(() => {
    if (!markdown) return;
    
    // Find all headings in the rendered content
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    
    // Array to store the event listener functions for cleanup
    const clickHandlers = [];
    
    headings.forEach(heading => {
      if (!heading.id) {
        heading.id = createId(heading.textContent);
      }
      
      // Add click handler to all heading elements for smooth scrolling
      heading.style.cursor = 'pointer';
      
      const clickHandler = () => {
        // Update the URL hash without scrolling
        window.history.pushState(null, '', `#${heading.id}`);
      };
      
      // Store the handler for cleanup
      clickHandlers.push({ element: heading, handler: clickHandler });
      
      heading.addEventListener('click', clickHandler);
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
    
    // Clean up event listeners
    return () => {
      clickHandlers.forEach(({ element, handler }) => {
        if (element) {
          element.removeEventListener('click', handler);
        }
      });
    };
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
              <img className="markdown-image" {...props} alt={props.alt || ''} loading="lazy" />
            ),
          }}
        >
          {markdown || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRenderer;