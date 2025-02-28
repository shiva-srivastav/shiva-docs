// src/components/MermaidDiagram.js
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import '../styles/MermaidDiagram.css';

// Initialize mermaid with default configuration
mermaid.initialize({
  startOnLoad: true,
  theme: document.documentElement.classList.contains('dark-theme') ? 'dark' : 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

const MermaidDiagram = ({ chart }) => {
  const mermaidRef = useRef(null);
  const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (!mermaidRef.current) return;

    // Function to render the diagram using mermaid.render()
    const renderDiagram = () => {
      mermaid
        .render(id, chart)
        .then(({ svg }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg;
          }
        })
        .catch(error => {
          console.error('Mermaid rendering error:', error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `<div class="mermaid-error">Diagram rendering error: ${error.message}</div>`;
          }
        });
    };

    renderDiagram();

    // Function to update the diagram when theme changes
    const updateTheme = () => {
      if (!mermaidRef.current) return;
      const isDarkTheme = document.documentElement.classList.contains('dark-theme');
      mermaid.initialize({
        startOnLoad: true,
        theme: isDarkTheme ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });
      try {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = chart;
          mermaid.init(undefined, mermaidRef.current);
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<div class="mermaid-error">Diagram rendering error: ${error.message}</div>`;
        }
      }
    };

    // Observe changes to the document class (for theme changes)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, [chart, id]);

  return (
    <div className="mermaid-diagram-container">
      <div ref={mermaidRef} className="mermaid-diagram"></div>
    </div>
  );
};

export default MermaidDiagram;
