// src/utils/markdownLoader.js
export const loadMarkdownFile = async (category, slug) => {
    try {
      const response = await fetch(`/content/${category}/${slug}.md`);
      if (!response.ok) {
        throw new Error(`Failed to load markdown file: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error loading markdown file:', error);
      return `# Error\n\nCould not load the requested content.`;
    }
  };