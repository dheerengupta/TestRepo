const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');

class ContentProcessor {
  constructor() {
    this.supportedFormats = ['.pdf', '.doc', '.docx', '.txt'];
  }

  async extractFromDocument(filePath) {
    try {
      const ext = path.extname(filePath).toLowerCase();
      let extractedText = '';

      switch (ext) {
        case '.pdf':
          extractedText = await this.extractFromPDF(filePath);
          break;
        case '.doc':
        case '.docx':
          extractedText = await this.extractFromWord(filePath);
          break;
        case '.txt':
          extractedText = await this.extractFromText(filePath);
          break;
        default:
          throw new Error(`Unsupported file format: ${ext}`);
      }

      return this.cleanText(extractedText);

    } catch (error) {
      console.error('Error extracting from document:', error);
      throw new Error('Failed to extract content from document');
    }
  }

  async extractFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  async extractFromWord(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error('Error extracting from Word document:', error);
      throw new Error('Failed to extract text from Word document');
    }
  }

  async extractFromText(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content;
    } catch (error) {
      console.error('Error reading text file:', error);
      throw new Error('Failed to read text file');
    }
  }

  cleanText(text) {
    // Remove excessive whitespace and normalize line breaks
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }

  async structureContent(content, template = 'professional') {
    try {
      if (!content || !content.slides) {
        throw new Error('Invalid content structure');
      }

      const structuredSlides = content.slides.map((slide, index) => {
        return this.enhanceSlideStructure(slide, template, index);
      });

      return {
        ...content,
        slides: structuredSlides,
        metadata: {
          template: template,
          slideCount: structuredSlides.length,
          createdAt: new Date().toISOString(),
          estimatedDuration: this.estimatePresentationDuration(structuredSlides)
        }
      };

    } catch (error) {
      console.error('Error structuring content:', error);
      throw new Error('Failed to structure content');
    }
  }

  enhanceSlideStructure(slide, template, index) {
    const enhancedSlide = {
      ...slide,
      id: `slide_${index + 1}_${Date.now()}`,
      template: template,
      layout: this.determineSlideLayout(slide),
      animations: this.getDefaultAnimations(template),
      timing: this.estimateSlideTiming(slide)
    };

    // Add template-specific enhancements
    switch (template) {
      case 'corporate':
        enhancedSlide.colorScheme = 'blue-corporate';
        enhancedSlide.fontFamily = 'Calibri';
        break;
      case 'creative':
        enhancedSlide.colorScheme = 'vibrant-creative';
        enhancedSlide.fontFamily = 'Montserrat';
        break;
      case 'academic':
        enhancedSlide.colorScheme = 'neutral-academic';
        enhancedSlide.fontFamily = 'Times New Roman';
        break;
      default:
        enhancedSlide.colorScheme = 'professional-blue';
        enhancedSlide.fontFamily = 'Arial';
    }

    return enhancedSlide;
  }

  determineSlideLayout(slide) {
    if (slide.type === 'title') {
      return 'title-slide';
    }

    if (slide.bulletPoints && slide.bulletPoints.length > 0) {
      if (slide.bulletPoints.length <= 3) {
        return 'content-large';
      } else if (slide.bulletPoints.length <= 6) {
        return 'content-medium';
      } else {
        return 'content-dense';
      }
    }

    if (slide.visualSuggestion && slide.visualSuggestion.includes('chart')) {
      return 'chart-focus';
    }

    if (slide.visualSuggestion && slide.visualSuggestion.includes('image')) {
      return 'image-content';
    }

    return 'content-standard';
  }

  getDefaultAnimations(template) {
    const animationSets = {
      corporate: {
        slideTransition: 'fade',
        bulletAnimation: 'fly-in-left',
        timing: 'medium'
      },
      creative: {
        slideTransition: 'zoom',
        bulletAnimation: 'bounce-in',
        timing: 'fast'
      },
      academic: {
        slideTransition: 'push',
        bulletAnimation: 'appear',
        timing: 'slow'
      },
      professional: {
        slideTransition: 'fade',
        bulletAnimation: 'fly-in-bottom',
        timing: 'medium'
      }
    };

    return animationSets[template] || animationSets.professional;
  }

  estimateSlideTiming(slide) {
    let baseTime = 30; // 30 seconds base per slide

    if (slide.bulletPoints) {
      baseTime += slide.bulletPoints.length * 10; // 10 seconds per bullet point
    }

    if (slide.speakerNotes) {
      const wordCount = slide.speakerNotes.split(' ').length;
      baseTime += Math.ceil(wordCount / 2); // ~2 words per second
    }

    return Math.min(baseTime, 180); // Cap at 3 minutes per slide
  }

  estimatePresentationDuration(slides) {
    const totalSeconds = slides.reduce((total, slide) => {
      return total + (slide.timing || 60);
    }, 0);

    return {
      seconds: totalSeconds,
      minutes: Math.ceil(totalSeconds / 60),
      formatted: this.formatDuration(totalSeconds)
    };
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${seconds} seconds`;
    } else if (remainingSeconds === 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`;
    }
  }

  extractKeyTopics(text) {
    try {
      // Tokenize and remove stop words
      const tokens = natural.WordTokenizer.tokenize(text.toLowerCase());
      const filteredTokens = tokens.filter(token => 
        !natural.stopwords.includes(token) && 
        token.length > 3 &&
        /^[a-zA-Z]+$/.test(token)
      );

      // Calculate term frequency
      const termFreq = {};
      filteredTokens.forEach(token => {
        termFreq[token] = (termFreq[token] || 0) + 1;
      });

      // Get top terms
      const sortedTerms = Object.entries(termFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([term]) => term);

      return sortedTerms;

    } catch (error) {
      console.error('Error extracting key topics:', error);
      return [];
    }
  }

  splitIntoSections(text, maxSections = 10) {
    try {
      // Split by paragraphs or major breaks
      const paragraphs = text.split(/\n\s*\n/);
      
      if (paragraphs.length <= maxSections) {
        return paragraphs.filter(p => p.trim().length > 50);
      }

      // If too many paragraphs, group them
      const sectionsPerGroup = Math.ceil(paragraphs.length / maxSections);
      const sections = [];

      for (let i = 0; i < paragraphs.length; i += sectionsPerGroup) {
        const section = paragraphs.slice(i, i + sectionsPerGroup).join('\n\n');
        if (section.trim().length > 50) {
          sections.push(section);
        }
      }

      return sections;

    } catch (error) {
      console.error('Error splitting into sections:', error);
      return [text];
    }
  }

  generateSlideTitle(content, index) {
    try {
      // Extract first sentence or meaningful phrase
      const sentences = content.split(/[.!?]+/);
      const firstSentence = sentences[0]?.trim();

      if (firstSentence && firstSentence.length < 60) {
        return firstSentence;
      }

      // Extract key phrases
      const words = content.split(' ').slice(0, 10);
      const title = words.join(' ');

      return title.length > 60 ? title.substring(0, 57) + '...' : title;

    } catch (error) {
      console.error('Error generating slide title:', error);
      return `Slide ${index + 1}`;
    }
  }

  validateContentStructure(content) {
    const required = ['title', 'slides'];
    const missing = required.filter(field => !content[field]);

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (!Array.isArray(content.slides) || content.slides.length === 0) {
      throw new Error('Slides must be a non-empty array');
    }

    // Validate each slide
    content.slides.forEach((slide, index) => {
      if (!slide.title) {
        throw new Error(`Slide ${index + 1} is missing a title`);
      }
      if (!slide.type) {
        slide.type = 'content'; // Default type
      }
    });

    return true;
  }
}

module.exports = new ContentProcessor();