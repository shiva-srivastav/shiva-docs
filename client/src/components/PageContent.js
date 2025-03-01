// src/components/PageContent.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownRenderer from './MarkdownRenderer';
import TableOfContents from './TableOfContents';
import Breadcrumbs from './Breadcrumbs';
import Loading from './Loading';
import PageNavigation from './PageNavigation';
import ContentActions from './ContentActions';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import '../styles/PageContent.css';

const PageContent = () => {
  const { category, page } = useParams();
  const { getContent, sidebarData } = useContent();
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);

  // Define findPrevNextPages as a memoized callback
  const findPrevNextPages = useCallback((category, page) => {
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
  }, [sidebarData]);

  useEffect(() => {
    if (category && page) {
      setLoading(true);
      setError(null);
      
      try {
        // Get content from our context
        const markdownContent = getContent(category, page);
        
        if (markdownContent) {
          setContent(markdownContent);
          
          // Extract title from the markdown content
          const titleMatch = markdownContent.match(/^# (.*?)$/m);
          if (titleMatch && titleMatch[1]) {
            setCurrentTitle(titleMatch[1]);
          } else {
            // If no title found in content, try to get it from sidebarData
            const categoryData = sidebarData.find(cat => cat.slug === category);
            if (categoryData) {
              const pageData = categoryData.items.find(item => item.slug === page);
              if (pageData) {
                setCurrentTitle(pageData.name);
              } else {
                setCurrentTitle(page);
              }
            } else {
              setCurrentTitle(page);
            }
          }
          
          // Find previous and next pages
          findPrevNextPages(category, page);
        } else {
          setContent('# Content Not Found\n\nThe requested content could not be found.');
          setCurrentTitle('Content Not Found');
          setError('Content not found');
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setContent('# Error Loading Content\n\nThere was a problem loading the requested content.');
        setCurrentTitle('Error');
        setError('Error loading content');
      } finally {
        // Simulate loading delay for better UX
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    } else if (category && !page) {
      // Handle category page (no specific page selected)
      setLoading(true);
      
      const categoryData = sidebarData.find(cat => cat.slug === category);
      
      if (categoryData) {
        // Create a category landing page with links to all pages
        let categoryContent = `# ${categoryData.name}\n\n`;
        categoryContent += `Welcome to the ${categoryData.name} section.\n\n`;
        
        if (categoryData.items && categoryData.items.length > 0) {
          categoryContent += '## Pages in this section\n\n';
          categoryData.items.forEach(item => {
            categoryContent += `- [${item.name}](/${category}/${item.slug})\n`;
          });
        } else {
          categoryContent += 'There are no pages in this section yet.';
        }
        
        setContent(categoryContent);
        setCurrentTitle(categoryData.name);
      } else {
        setContent('# Category Not Found\n\nThe requested category could not be found.');
        setCurrentTitle('Category Not Found');
        setError('Category not found');
      }
      
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }
  }, [category, page, getContent, sidebarData, findPrevNextPages]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="page-content">
      <Breadcrumbs />
      {error && <div className="error-message">{error}</div>}
      <div className="content-wrapper">
        <div className="content-main">
          <MarkdownRenderer markdown={content} />
          
          {/* Only show Content Actions if authenticated and viewing a specific page */}
          {isAuthenticated && category && page && (
            <ContentActions 
              category={category} 
              slug={page} 
              title={currentTitle}
            />
          )}
          
          <PageNavigation prevPage={prevPage} nextPage={nextPage} />
        </div>
        <div className="content-sidebar">
          <TableOfContents markdown={content} />
        </div>
      </div>
    </div>
  );
};

export default PageContent;