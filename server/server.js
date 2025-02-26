// server/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const MarkdownIt = require('markdown-it');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 5000;
const md = new MarkdownIt();

// Authentication constants
const JWT_SECRET = 'shiva-docs-jwt-secret-key';
const ADMIN_USERNAME = 'admin';
// This is a bcrypt hash for 'shiva#docs#telusko'
const ADMIN_PASSWORD_HASH = '$2b$10$NGFzLzwQjVigPG9.sQ2Pm.x.oGcyrlK7.S4ukVYbb3xXtGvuXLND6';

// Middleware
app.use(cors());
app.use(express.json());

// Content directory path
const contentDir = path.join(__dirname, 'content');

// Authentication middleware to protect routes
const authenticateToken = (req, res, next) => {
  console.log('Authenticating request to:', req.originalUrl);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    console.log('Token verified successfully for user:', user.username);
    req.user = user;
    next();
  });
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'content', 'images'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Login route with improved logging
app.post('/api/login', async (req, res) => {
  try {
    console.log('Login attempt received');
    const { username, password } = req.body;
    
    console.log('Login attempt for username:', username);
    
    // Validate input
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Check username (case insensitive)
    if (username.toLowerCase() !== ADMIN_USERNAME.toLowerCase()) {
      console.log('Username incorrect');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('Username correct, checking password');
    
    // Check password
    const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    console.log('Password comparison result:', passwordMatch);
    
    if (!passwordMatch) {
      console.log('Password incorrect');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { username: ADMIN_USERNAME },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('Login successful, token generated');
    
    // Return the token
    res.json({ 
      token,
      user: { username: ADMIN_USERNAME }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify token route
app.get('/api/verify-token', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working correctly' });
});

// Route to get all available categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await fs.readdir(contentDir);
    const categoriesData = [];
    
    for (const category of categories) {
      const categoryPath = path.join(contentDir, category);
      const stat = await fs.stat(categoryPath);
      
      if (stat.isDirectory() && category !== 'images') {
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

// Apply authentication to all admin routes
app.use('/api/admin/*', authenticateToken);

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

// Upload an image
app.post('/api/admin/images', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Get the server's base URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${baseUrl}/content/images/${req.file.filename}`;
    
    res.status(201).json({
      url: imageUrl,
      name: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get all images
app.get('/api/admin/images', async (req, res) => {
  try {
    const imagesDir = path.join(contentDir, 'images');
    
    if (!(await fs.pathExists(imagesDir))) {
      return res.json({ images: [] });
    }
    
    const files = await fs.readdir(imagesDir);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const images = await Promise.all(files.map(async (file) => {
      const filePath = path.join(imagesDir, file);
      const stats = await fs.stat(filePath);
      
      return {
        name: file,
        url: `${baseUrl}/content/images/${file}`,
        size: stats.size,
        created: stats.birthtime
      };
    }));
    
    res.json({ images });
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ error: 'Failed to get images' });
  }
});

// Delete an image
app.delete('/api/admin/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(contentDir, 'images', filename);
    
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Serve static images
app.use('/content/images', express.static(path.join(contentDir, 'images')));

// Create content directories if they don't exist
async function initializeContentDirectories() {
  try {
    // Create the main content directory if it doesn't exist
    await fs.ensureDir(contentDir);
    
    // Create the images directory
    await fs.ensureDir(path.join(contentDir, 'images'));
    
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
    console.log(`Authentication enabled with username: ${ADMIN_USERNAME}`);
  });
});