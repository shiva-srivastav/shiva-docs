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
    if (mermaidRef.current) {
      // Check for theme changes
      const updateTheme = () => {
        const isDarkTheme = document.documentElement.classList.contains('dark-theme');
        mermaid.initialize({
          startOnLoad: true,
          theme: isDarkTheme ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'inherit',
        });
        
        // Re-render with new theme
        try {
          mermaidRef.current.innerHTML = chart;
          mermaid.init(undefined, mermaidRef.current);
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          mermaidRef.current.innerHTML = `<div class="mermaid-error">Diagram rendering error: ${error.message}</div>`;
        }
      };

      // Initial render
      try {
        mermaid.render(id, chart).then(({ svg }) => {
          mermaidRef.current.innerHTML = svg;
        }).catch(error => {
          console.error('Mermaid rendering error:', error);
          mermaidRef.current.innerHTML = `<div class="mermaid-error">Diagram rendering error: ${error.message}</div>`;
        });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        mermaidRef.current.innerHTML = `<div class="mermaid-error">Diagram rendering error: ${error.message}</div>`;
      }

      // Listen for theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            updateTheme();
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });
      
      // Cleanup observer on unmount
      return () => observer.disconnect();
    }
  }, [chart]);

  return (
    <div className="mermaid-diagram-container">
      <div ref={mermaidRef} className="mermaid-diagram"></div>
    </div>
  );
};

export default MermaidDiagram;