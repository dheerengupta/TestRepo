# SlideCraft - AI-Powered Presentation Generator

SlideCraft is an advanced AI-powered application that allows users to create professional-quality PowerPoint presentations instantly by simply providing a topic, uploading a document, or sharing a URL. It aims to save time, boost productivity, and assist professionals, educators, and students in creating visually compelling and content-rich presentations with minimal effort.

![SlideCraft Banner](https://via.placeholder.com/800x300/2E4B8A/FFFFFF?text=SlideCraft+-+AI+Powered+Presentations)

## 🚀 Features

### 📝 Multiple Input Methods
- **Topic-based Generation**: Enter any topic and let AI research and create comprehensive presentations
- **Document Upload**: Upload PDF, Word, or text files to automatically generate slides
- **URL Scraping**: Provide a web page URL to extract and summarize content into slides

### 🎨 Professional Design
- **4 Premium Templates**: Professional, Corporate, Creative, and Academic designs
- **Customizable Themes**: Adjust colors, fonts, and layouts to match your brand
- **Auto-generated Visuals**: AI suggests appropriate images, charts, and icons
- **Responsive Layouts**: Optimized for different content types and slide counts

### 🤖 AI-Powered Content
- **Smart Content Analysis**: Advanced NLP for content extraction and summarization
- **Structured Slide Generation**: Automatic title creation, bullet points, and speaker notes
- **Visual Recommendations**: AI suggests relevant imagery and chart types
- **Content Optimization**: Ensures proper slide timing and presentation flow

### ☁️ Cloud Integration
- **Google Drive**: Save presentations directly to your Google Drive
- **OneDrive**: Integrate with Microsoft OneDrive for seamless storage
- **Google Slides**: Export directly to Google Slides for online editing
- **Multiple Formats**: Download as PPTX, PDF, or share online

### ⚡ Advanced Features
- **Real-time Preview**: See your slides as they're generated
- **Slide Editing**: Reorder, edit, and customize slides before export
- **Version History**: Track changes and restore previous versions
- **Presentation Analytics**: Estimated duration and reading time
- **Mobile Responsive**: Create and edit on any device

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- Optional: Google Cloud/Microsoft Graph API credentials for cloud features

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/slidecraft.git
cd slidecraft
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Required: OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Google Cloud Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Optional: Microsoft Graph API
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# Application Configuration
PORT=3000
NODE_ENV=development
SESSION_SECRET=your_session_secret_here

# Optional: External APIs for enhanced visuals
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
PEXELS_API_KEY=your_pexels_api_key
```

### 4. Start the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## 🎯 Usage Guide

### Creating a Presentation from a Topic
1. Navigate to the main page
2. Select "From Topic" tab
3. Enter your presentation topic (e.g., "AI in Healthcare")
4. Choose the number of slides (8-20)
5. Select a template
6. Click "Generate Presentation"
7. Review and download your presentation

### Uploading a Document
1. Select "From Document" tab
2. Drag and drop or browse to upload your file
3. Supported formats: PDF, DOC, DOCX, TXT (max 10MB)
4. Choose a template
5. Click "Create from Document"
6. AI will extract key content and create slides

### Using a URL
1. Select "From URL" tab
2. Paste the URL of the article or webpage
3. Choose a template
4. Click "Generate from URL"
5. AI will scrape and summarize the content

### Customizing Your Presentation
1. After generation, click "Edit Slides"
2. Modify colors, fonts, and layouts
3. Reorder slides by dragging
4. Edit text content directly
5. Apply changes and download

## 🏗️ Architecture

### Backend Services
- **Express.js Server**: RESTful API with security middleware
- **AI Service**: OpenAI integration for content generation
- **Content Processor**: Document parsing and text extraction
- **Presentation Generator**: PowerPoint creation with PptxGenJS
- **URL Scraper**: Web content extraction with Cheerio
- **Cloud Storage**: Google Drive and OneDrive integration

### Frontend
- **Vanilla JavaScript**: Modern ES6+ with class-based architecture
- **Responsive CSS**: Custom CSS with CSS variables and grid layouts
- **Progressive Web App**: Service worker support for offline functionality
- **Modern UI/UX**: Clean, professional interface with smooth animations

### File Structure
```
slidecraft/
├── server.js                 # Main Express server
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── services/                 # Backend services
│   ├── aiService.js          # OpenAI integration
│   ├── contentProcessor.js   # Document processing
│   ├── presentationGenerator.js # PowerPoint generation
│   ├── urlScraper.js         # Web scraping
│   └── cloudStorage.js       # Cloud integration
├── public/                   # Frontend assets
│   ├── index.html            # Main HTML file
│   ├── css/
│   │   └── styles.css        # Comprehensive styles
│   ├── js/
│   │   └── app.js            # Frontend application
│   └── images/               # Static images
├── uploads/                  # Temporary file storage
├── templates/                # Presentation templates
└── README.md                 # This file
```

## 🔧 API Endpoints

### Presentation Generation
- `POST /api/generate-from-topic` - Generate from topic
- `POST /api/generate-from-document` - Generate from uploaded document
- `POST /api/generate-from-url` - Generate from URL

### Presentation Management
- `GET /api/templates` - Get available templates
- `GET /api/download/:presentationId` - Download presentation
- `PUT /api/presentations/:presentationId` - Update presentation
- `GET /api/history` - Get presentation history

### Cloud Integration
- `POST /api/save-to-cloud` - Save to cloud storage
- `GET /api/auth/google` - Google OAuth flow
- `GET /api/auth/microsoft` - Microsoft OAuth flow

## 🎨 Templates

### Professional
- Clean, modern design for business presentations
- Blue color scheme with professional typography
- Suitable for corporate meetings and proposals

### Corporate
- Formal design for executive presentations
- Conservative color palette with structured layouts
- Perfect for board meetings and formal reports

### Creative
- Vibrant design for creative and marketing presentations
- Bold colors with dynamic layouts
- Ideal for agencies and creative industries

### Academic
- Traditional design for educational presentations
- Neutral colors with clear, readable fonts
- Perfect for lectures and research presentations

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitizes all user inputs
- **File Type Validation**: Restricts allowed file uploads
- **CORS Protection**: Configurable cross-origin policies
- **Helmet.js**: Security headers and CSP
- **Environment Variables**: Secure API key management

## 🚀 Deployment

### Docker Deployment
```bash
# Build the image
docker build -t slidecraft .

# Run the container
docker run -p 3000:3000 --env-file .env slidecraft
```

### Heroku Deployment
```bash
# Install Heroku CLI and login
heroku create your-slidecraft-app

# Set environment variables
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e
```

### Manual Testing
1. Test all three input methods
2. Verify file upload functionality
3. Check template switching
4. Test download functionality
5. Validate responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write unit tests for new features
- Update documentation for API changes
- Use semantic commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Q: Getting OpenAI API errors**
A: Ensure your OpenAI API key is valid and has sufficient credits

**Q: File upload not working**
A: Check file size (max 10MB) and format (PDF, DOC, DOCX, TXT)

**Q: Cloud save not working**
A: Verify Google/Microsoft API credentials are configured correctly

### Getting Help
- 📧 Email: support@slidecraft.com
- 💬 Discord: [SlideCraft Community](https://discord.gg/slidecraft)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/slidecraft/issues)
- 📖 Documentation: [Full Documentation](https://docs.slidecraft.com)

## 🔮 Roadmap

### Upcoming Features
- [ ] Real-time collaboration
- [ ] Advanced chart generation
- [ ] Video embedding support
- [ ] AI-powered image generation
- [ ] Voice narration
- [ ] Advanced animations
- [ ] Team workspaces
- [ ] API for developers
- [ ] Mobile app

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added cloud storage integration
- **v1.2.0** - Enhanced AI content generation
- **v1.3.0** - Mobile responsive design

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- PptxGenJS for PowerPoint generation
- Cheerio for web scraping
- Inter font family
- Font Awesome icons
- The open-source community

---

**Made with ❤️ by the SlideCraft Team**

Transform your ideas into stunning presentations with the power of AI!