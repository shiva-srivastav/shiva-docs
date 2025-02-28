// src/components/MarkdownRenderer.js
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { createRoot } from 'react-dom/client';
import CodeBlock from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';
import '../styles/MarkdownRenderer.css';

const MarkdownRenderer = ({ markdown }) => {
  const [mermaidDiagrams, setMermaidDiagrams] = useState([]);
  const [processedMarkdown, setProcessedMarkdown] = useState('');
  // Store root references for proper cleanup
  const [rootRefs, setRootRefs] = useState([]);

  // Process the markdown to extract mermaid diagrams
  useEffect(() => {
    if (!markdown) {
      setProcessedMarkdown('');
      setMermaidDiagrams([]);
      return;
    }

    const mermaidPattern = /```mermaid\n([\s\S]*?)```/g;
    const diagrams = [];
    let lastIndex = 0;
    let result = '';
    let match;

    // Reset the regex index
    mermaidPattern.lastIndex = 0;

    while ((match = mermaidPattern.exec(markdown)) !== null) {
      // Add text before the diagram
      result += markdown.substring(lastIndex, match.index);
      
      // Generate a unique ID for this diagram
      const id = `mermaid-${diagrams.length}-${Date.now().toString(36)}`;
      
      // Add a placeholder for the diagram
      result += `<div id="${id}" class="mermaid-placeholder"></div>`;
      
      // Store the diagram information
      diagrams.push({
        id,
        code: match[1].trim()
      });
      
      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    result += markdown.substring(lastIndex);
    
    // If no mermaid diagrams found, use the original markdown
    if (diagrams.length === 0) {
      setProcessedMarkdown(markdown);
    } else {
      setProcessedMarkdown(result);
    }
    
    setMermaidDiagrams(diagrams);
  }, [markdown]);

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

  // Render mermaid diagrams
  useEffect(() => {
    // Cleanup previous roots
    rootRefs.forEach(({ root }) => {
      try {
        root.unmount();
      } catch (error) {
        console.error('Error unmounting React component:', error);
      }
    });
    
    const newRootRefs = [];
    
    // For each mermaid diagram, find its placeholder and render the component
    mermaidDiagrams.forEach(diagram => {
      const placeholder = document.getElementById(diagram.id);
      if (placeholder) {
        // Clear any existing content
        placeholder.innerHTML = '';
        
        // Create a new diagram component
        const diagramDiv = document.createElement('div');
        placeholder.appendChild(diagramDiv);
        
        // Use createRoot to render the MermaidDiagram component
        try {
          const root = createRoot(diagramDiv);
          root.render(<MermaidDiagram chart={diagram.code} />);
          
          // Store the root reference for cleanup
          newRootRefs.push({ root, element: diagramDiv });
        } catch (error) {
          console.error('Error rendering Mermaid diagram:', error);
          diagramDiv.innerHTML = `<div class="mermaid-error">Error rendering diagram: ${error.message}</div>`;
        }
      }
    });
    
    // Update the state with the new root references
    setRootRefs(newRootRefs);
    
    // Cleanup function for component unmount
    return () => {
      newRootRefs.forEach(({ root }) => {
        try {
          root.unmount();
        } catch (error) {
          console.error('Error unmounting React component:', error);
        }
      });
    };
  }, [mermaidDiagrams]);

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
          {processedMarkdown || ''}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownRenderer;