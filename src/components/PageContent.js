// src/components/PageContent.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';
import Breadcrumbs from './Breadcrumbs';
import Loading from './Loading';
import PageNavigation from './PageNavigation';
import { useContent } from '../context/ContentContext';
import '../styles/PageContent.css';

const PageContent = () => {
  const { category, page } = useParams();
  const { getContent, sidebarData } = useContent();
  const [content, setContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);

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
      
      // Find previous and next pages
      findPrevNextPages(category, page);
      
      // Simulate loading delay
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [category, page, getContent, sidebarData]);

  const findPrevNextPages = (category, page) => {
    // Find the current category in sidebar data
    const categoryData = sidebarData.find(cat => cat.slug === category);
    
    if (categoryData && categoryData.items && categoryData.items.length > 0) {
      // Find current page index
      const currentIndex = categoryData.items.findIndex(item => item.slug === page);
      
      if (currentIndex > -1) {
        // Set previous page (if not the first page)
        if (currentIndex > 0) {
          setPrevPage({
            title: categoryData.items[currentIndex - 1].name,
            category: category,
            slug: categoryData.items[currentIndex - 1].slug
          });
        } else {
          setPrevPage(null);
        }
        
        // Set next page (if not the last page)
        if (currentIndex < categoryData.items.length - 1) {
          setNextPage({
            title: categoryData.items[currentIndex + 1].name,
            category: category,
            slug: categoryData.items[currentIndex + 1].slug
          });
        } else {
          setNextPage(null);
        }
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-content">
      <Breadcrumbs />
      <div className="content-wrapper">
        <div className="content-main">
          <MarkdownRenderer markdown={content} />
          <PageNavigation prevPage={prevPage} nextPage={nextPage} />
        </div>
        <div className="content-sidebar">
          <TableOfContents headings={headings} />
        </div>
      </div>
    </div>
  );
};

export default PageContent;