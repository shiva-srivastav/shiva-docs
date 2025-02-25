// server/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const MarkdownIt = require('markdown-it');

const app = express();
const port = process.env.PORT || 5000;
const md = new MarkdownIt();

// Middleware
app.use(cors());
app.use(express.json());

// Content directory path
const contentDir = path.join(__dirname, 'content');

// Route to get all available categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await fs.readdir(contentDir);
    const categoriesData = [];
    
    for (const category of categories) {
      const categoryPath = path.join(contentDir, category);
      const stat = await fs.stat(categoryPath);
      
      if (stat.isDirectory()) {
        const files = await fs.readdir(categoryPath);
        const items = [];
        
        for (const file of files) {
          if (file.endsWith('.md')) {
            const slug = file.replace('.md', '');
            const filePath = path.join(categoryPath, file);
            const content = await fs.readFile(filePath, 'utf8');
            
            // Extract title from markdown h1 heading
            const titleMatch = content.match(/^# (.*?)$/m);
            const name = titleMatch ? titleMatch[1] : slug;
            
            items.push({ name, slug });
          }
        }
        
        categoriesData.push({
          name: category.charAt(0).toUpperCase() + category.slice(1),
          slug: category,
          items
        });
      }
    }
    
    res.json(categoriesData);
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Route to get a specific markdown file
app.get('/api/content/:category/:slug', async (req, res) => {
  try {
    const { category, slug } = req.params;
    const filePath = path.join(contentDir, category, `${slug}.md`);
    
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf8');
      res.send(content);
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({ error: 'Failed to get content' });
  }
});

// Admin routes to manage content

// Create a new category
app.post('/api/admin/categories', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const categoryPath = path.join(contentDir, slug);
    
    if (await fs.pathExists(categoryPath)) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    
    await fs.mkdir(categoryPath);
    res.status(201).json({ name, slug });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Create or update content in a category
app.post('/api/admin/content/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { title, slug, content } = req.body;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }
    
    const categoryPath = path.join(contentDir, category);
    
    if (!(await fs.pathExists(categoryPath))) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const filePath = path.join(categoryPath, `${slug}.md`);
    
    // If the title is not already in the content as an H1, add it
    let finalContent = content;
    if (!content.match(/^# /m)) {
      finalContent = `# ${title}\n\n${content}`;
    }
    
    await fs.writeFile(filePath, finalContent);
    res.status(201).json({ category, title, slug });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

// Delete content
app.delete('/api/admin/content/:category/:slug', async (req, res) => {
  try {
    const { category, slug } = req.params;
    const filePath = path.join(contentDir, category, `${slug}.md`);
    
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      res.status(200).json({ message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ error: 'Content not found' });
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Delete category
app.delete('/api/admin/categories/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const categoryPath = path.join(contentDir, category);
    
    if (await fs.pathExists(categoryPath)) {
      await fs.remove(categoryPath);
      res.status(200).json({ message: 'Category deleted successfully' });
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Create content directories if they don't exist
async function initializeContentDirectories() {
  try {
    // Create the main content directory if it doesn't exist
    await fs.ensureDir(contentDir);
    
    // Create default categories if they don't exist
    const defaultCategories = ['basics', 'tutorials', 'api'];
    for (const category of defaultCategories) {
      await fs.ensureDir(path.join(contentDir, category));
    }
    
    console.log('Content directories initialized');
  } catch (error) {
    console.error('Error initializing content directories:', error);
  }
}

// Start the server
initializeContentDirectories().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});