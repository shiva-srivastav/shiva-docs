// src/components/PageContent.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';
import Breadcrumbs from './Breadcrumbs';
import Loading from './Loading';
import { useContent } from '../context/ContentContext';
import '../styles/PageContent.css';

const PageContent = () => {
  const { category, page } = useParams();
  const { getContent } = useContent();
  const [content, setContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category && page) {
      setLoading(true);
      
      // Get content from our context
      const markdownContent = getContent(category, page);
      
      if (markdownContent) {
        setContent(markdownContent);
        
        // Extract headings for table of contents
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        const extractedHeadings = [];
        let match;
        
        while ((match = headingRegex.exec(markdownContent)) !== null) {
          const level = match[1].length;
          const title = match[2];
          extractedHeadings.push({ level, title });
        }
        
        setHeadings(extractedHeadings);
      } else {
        setContent('# Content Not Found\n\nThe requested content could not be found.');
        setHeadings([]);
      }
      
      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [category, page, getContent]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-content">
      <Breadcrumbs />
      <div className="content-wrapper">
        <div className="content-main">
          <MarkdownRenderer markdown={content} />
        </div>
        <div className="content-sidebar">
          <TableOfContents headings={headings} />
        </div>
      </div>
    </div>
  );
};

export default PageContent;