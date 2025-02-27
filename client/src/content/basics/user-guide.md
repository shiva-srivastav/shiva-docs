# Shiva Docs User Guide

This guide explains how to use and maintain the Shiva Docs documentation website. The website is built with React and provides a beautiful, responsive interface for markdown-based documentation.

## Project Structure

The Shiva Docs project is organized as follows:

```
shiva-docs/
├── public/
│   └── content/        # Markdown content and images
│       ├── basics/     # Markdown files for "Basics" category
│       ├── tutorials/  # Markdown files for "Tutorials" category
│       ├── api/        # Markdown files for "API" category
│       └── images/     # Images used in markdown files
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── data/           # Data files for the sidebar
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # CSS files
│   ├── utils/          # Utility functions
│   ├── App.js          # Main app component
│   └── index.js        # Entry point
└── package.json        # Dependencies and scripts
```

## Adding New Content

### Method 1: Using the Admin Interface

1. Navigate to `/admin` in your browser
2. Click "Create New Document" button
3. Fill in the metadata (category, title, and slug)
4. Write your content using the markdown editor
5. Click "Save Content" when finished

### Method 2: Adding Files Manually

1. Create a new markdown file in the appropriate category folder
   - Example: `public/content/tutorials/new-tutorial.md`
2. Add a reference to the file in the sidebar data
   - Update `src/data/sidebarData.js` with your new page information
3. Upload any images to `public/content/images/`

## Markdown Formatting

Shiva Docs supports standard markdown syntax with some additional features:

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Lists

```markdown
- Item 1
- Item 2
  - Nested item
  
1. Numbered item 1
2. Numbered item 2
```

### Code Blocks

```markdown
```javascript
function example() {
  console.log('Hello, world!');
}
```
```

### Images

```markdown
![Alt text](/content/images/your-image.png)
```

### Links

```markdown
[Link text](/category/page)
```

## Managing Images

1. Go to the `/admin` page
2. Click on the "Images" tab
3. Use the drag-and-drop uploader to add new images
4. Once uploaded, reference them in your markdown using:
   ```markdown
   ![Alt text](/content/images/your-image.png)
   ```

## Customizing the Site

### Changing the Theme

The site supports light and dark themes:

1. Click the theme toggle button in the top-right corner
2. The site will remember your preference

### Updating Categories

To add or modify sidebar categories:

1. Edit `src/context/ContentContext.js`
2. Modify the `initialSidebarData` array

### Customizing Styles

1. CSS files are located in the `src/styles/` directory
2. Edit the appropriate CSS file to change the appearance

## Deployment

To deploy the Shiva Docs site:

1. Build the project
   ```bash
   npm run build
   ```
2. Deploy the contents of the `build` directory to your web server
3. Ensure your server is configured to handle React Router paths

## Troubleshooting

### Content Not Appearing

1. Check that the markdown file exists in the correct category folder
2. Verify the sidebar data includes a reference to your page
3. Ensure the slug in the URL matches the filename (without .md extension)

### Images Not Loading

1. Verify images are in the `/content/images/` directory
2. Check image paths in markdown (should be `/content/images/filename.png`)
3. Ensure image filenames don't contain special characters or spaces

## Getting Help

If you need additional assistance:

1. Check the documentation on GitHub
2. Open an issue in the GitHub repository
3. Contact the Shiva support team

---

Happy documenting with Shiva Docs!