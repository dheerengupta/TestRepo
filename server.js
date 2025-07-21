const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import custom modules
const aiService = require('./services/aiService');
const contentProcessor = require('./services/contentProcessor');
const presentationGenerator = require('./services/presentationGenerator');
const cloudStorage = require('./services/cloudStorage');
const urlScraper = require('./services/urlScraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.openai.com"]
    }
  }
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Static files
app.use(express.static('public'));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx|txt|ppt|pptx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only document files are allowed!'));
    }
  }
});

// Routes

// Serve main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// Generate presentation from topic
app.post('/api/generate-from-topic', async (req, res) => {
  try {
    const { topic, slideCount, template, customizations } = req.body;
    
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Generate content using AI
    const content = await aiService.generateContentFromTopic(topic, slideCount);
    
    // Process and structure the content
    const structuredContent = await contentProcessor.structureContent(content, template);
    
    // Generate presentation
    const presentation = await presentationGenerator.createPresentation(
      structuredContent, 
      template, 
      customizations
    );

    res.json({
      success: true,
      presentationId: presentation.id,
      slides: presentation.slides,
      downloadUrl: `/api/download/${presentation.id}`
    });

  } catch (error) {
    console.error('Error generating presentation from topic:', error);
    res.status(500).json({ error: 'Failed to generate presentation' });
  }
});

// Generate presentation from uploaded document
app.post('/api/generate-from-document', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { template, customizations } = req.body;
    
    // Extract content from uploaded document
    const extractedContent = await contentProcessor.extractFromDocument(req.file.path);
    
    // Process and summarize content
    const processedContent = await aiService.processDocumentContent(extractedContent);
    
    // Structure content for presentation
    const structuredContent = await contentProcessor.structureContent(processedContent, template);
    
    // Generate presentation
    const presentation = await presentationGenerator.createPresentation(
      structuredContent, 
      template, 
      JSON.parse(customizations || '{}')
    );

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      presentationId: presentation.id,
      slides: presentation.slides,
      downloadUrl: `/api/download/${presentation.id}`
    });

  } catch (error) {
    console.error('Error generating presentation from document:', error);
    res.status(500).json({ error: 'Failed to process document' });
  }
});

// Generate presentation from URL
app.post('/api/generate-from-url', async (req, res) => {
  try {
    const { url, template, customizations } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Scrape content from URL
    const scrapedContent = await urlScraper.scrapeUrl(url);
    
    // Process and summarize content
    const processedContent = await aiService.processWebContent(scrapedContent);
    
    // Structure content for presentation
    const structuredContent = await contentProcessor.structureContent(processedContent, template);
    
    // Generate presentation
    const presentation = await presentationGenerator.createPresentation(
      structuredContent, 
      template, 
      customizations
    );

    res.json({
      success: true,
      presentationId: presentation.id,
      slides: presentation.slides,
      downloadUrl: `/api/download/${presentation.id}`
    });

  } catch (error) {
    console.error('Error generating presentation from URL:', error);
    res.status(500).json({ error: 'Failed to process URL content' });
  }
});

// Demo status endpoint
app.get('/api/demo-status', (req, res) => {
  res.json({
    isDemoMode: !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here',
    message: 'Add your OpenAI API key to enable AI-powered content generation'
  });
});

// Get available templates
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await presentationGenerator.getTemplates();
    res.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Download presentation
app.get('/api/download/:presentationId', async (req, res) => {
  try {
    const { presentationId } = req.params;
    const { format = 'pptx' } = req.query;
    
    const filePath = await presentationGenerator.exportPresentation(presentationId, format);
    
    res.download(filePath, `presentation.${format}`, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ error: 'Failed to download presentation' });
      }
      // Clean up file after download
      fs.unlink(filePath).catch(console.error);
    });

  } catch (error) {
    console.error('Error downloading presentation:', error);
    res.status(500).json({ error: 'Failed to download presentation' });
  }
});

// Save to cloud storage
app.post('/api/save-to-cloud', async (req, res) => {
  try {
    const { presentationId, service, accessToken } = req.body;
    
    const result = await cloudStorage.savePresentation(presentationId, service, accessToken);
    
    res.json({
      success: true,
      cloudUrl: result.url,
      service: service
    });

  } catch (error) {
    console.error('Error saving to cloud:', error);
    res.status(500).json({ error: 'Failed to save to cloud storage' });
  }
});

// Get presentation history
app.get('/api/history', async (req, res) => {
  try {
    // In a real app, this would be user-specific
    const history = await presentationGenerator.getHistory();
    res.json({ history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Update presentation
app.put('/api/presentations/:presentationId', async (req, res) => {
  try {
    const { presentationId } = req.params;
    const { slides, template, customizations } = req.body;
    
    const updatedPresentation = await presentationGenerator.updatePresentation(
      presentationId, 
      slides, 
      template, 
      customizations
    );
    
    res.json({
      success: true,
      presentation: updatedPresentation
    });

  } catch (error) {
    console.error('Error updating presentation:', error);
    res.status(500).json({ error: 'Failed to update presentation' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`SlideCraft server running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});

module.exports = app;