const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

class URLScraper {
  constructor() {
    this.timeout = 10000; // 10 seconds
    this.maxContentLength = 50000; // 50KB max content
    this.userAgent = 'SlideCraft-Bot/1.0 (AI Presentation Generator)';
  }

  async scrapeUrl(url) {
    try {
      // Validate URL
      const validatedUrl = this.validateUrl(url);
      
      // Fetch the webpage
      const response = await this.fetchPage(validatedUrl);
      
      // Parse content
      const content = this.parseContent(response.data, validatedUrl);
      
      return content;

    } catch (error) {
      console.error('Error scraping URL:', error);
      throw new Error(`Failed to scrape content from URL: ${error.message}`);
    }
  }

  validateUrl(url) {
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTP and HTTPS
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Only HTTP and HTTPS URLs are supported');
      }

      // Block localhost and private IPs for security
      if (this.isPrivateUrl(urlObj.hostname)) {
        throw new Error('Private URLs are not allowed');
      }

      return urlObj.href;

    } catch (error) {
      throw new Error('Invalid URL format');
    }
  }

  isPrivateUrl(hostname) {
    const privatePatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/
    ];

    return privatePatterns.some(pattern => pattern.test(hostname));
  }

  async fetchPage(url) {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        maxContentLength: this.maxContentLength,
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept redirects
        }
      });

      return response;

    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - the website took too long to respond');
      } else if (error.response) {
        throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
      } else {
        throw new Error('Network error - unable to reach the website');
      }
    }
  }

  parseContent(html, url) {
    try {
      const $ = cheerio.load(html);
      
      // Remove unwanted elements
      this.removeUnwantedElements($);

      // Extract metadata
      const metadata = this.extractMetadata($);
      
      // Extract main content
      const content = this.extractMainContent($);
      
      // Extract additional elements
      const images = this.extractImages($, url);
      const links = this.extractLinks($, url);
      
      return {
        url: url,
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        content: content,
        text: this.cleanText(content),
        images: images.slice(0, 10), // Limit images
        links: links.slice(0, 20), // Limit links
        metadata: metadata,
        scrapedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error parsing content:', error);
      throw new Error('Failed to parse webpage content');
    }
  }

  removeUnwantedElements($) {
    // Remove scripts, styles, and other non-content elements
    const unwantedSelectors = [
      'script',
      'style',
      'nav',
      'header',
      'footer',
      '.advertisement',
      '.ads',
      '.sidebar',
      '.comments',
      '.social-media',
      '[class*="cookie"]',
      '[class*="popup"]',
      '[class*="modal"]'
    ];

    unwantedSelectors.forEach(selector => {
      $(selector).remove();
    });
  }

  extractMetadata($) {
    const metadata = {};

    // Title
    metadata.title = $('title').first().text().trim() ||
                    $('meta[property="og:title"]').attr('content') ||
                    $('meta[name="twitter:title"]').attr('content') ||
                    $('h1').first().text().trim();

    // Description
    metadata.description = $('meta[name="description"]').attr('content') ||
                          $('meta[property="og:description"]').attr('content') ||
                          $('meta[name="twitter:description"]').attr('content');

    // Author
    metadata.author = $('meta[name="author"]').attr('content') ||
                     $('meta[property="article:author"]').attr('content');

    // Publication date
    metadata.publishedDate = $('meta[property="article:published_time"]').attr('content') ||
                            $('meta[name="date"]').attr('content') ||
                            $('time[datetime]').attr('datetime');

    // Keywords
    metadata.keywords = $('meta[name="keywords"]').attr('content');

    // Language
    metadata.language = $('html').attr('lang') || 
                       $('meta[http-equiv="content-language"]').attr('content');

    return metadata;
  }

  extractMainContent($) {
    // Try to find main content using common selectors
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.main-content',
      '.post-content',
      '.entry-content',
      '#content',
      '#main',
      '.article-body',
      '.story-body'
    ];

    let mainContent = '';

    // Try each selector until we find substantial content
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        const text = element.text().trim();
        if (text.length > mainContent.length) {
          mainContent = text;
        }
      }
    }

    // If no main content found, extract from body
    if (!mainContent || mainContent.length < 200) {
      mainContent = $('body').text().trim();
    }

    // Extract paragraphs for better structure
    const paragraphs = [];
    $('p').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 50) { // Only include substantial paragraphs
        paragraphs.push(text);
      }
    });

    // Extract headings
    const headings = [];
    $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 0) {
        headings.push({
          level: elem.tagName.toLowerCase(),
          text: text
        });
      }
    });

    return {
      fullText: mainContent,
      paragraphs: paragraphs,
      headings: headings,
      structure: this.analyzeContentStructure(headings, paragraphs)
    };
  }

  analyzeContentStructure(headings, paragraphs) {
    const structure = {
      sections: [],
      hasIntroduction: false,
      hasConclusion: false,
      estimatedReadingTime: Math.ceil(paragraphs.join(' ').split(' ').length / 200) // ~200 words per minute
    };

    // Group content by headings
    let currentSection = null;
    let paragraphIndex = 0;

    headings.forEach(heading => {
      if (currentSection) {
        structure.sections.push(currentSection);
      }

      currentSection = {
        title: heading.text,
        level: heading.level,
        content: []
      };

      // Check for introduction/conclusion keywords
      const lowerTitle = heading.text.toLowerCase();
      if (lowerTitle.includes('introduction') || lowerTitle.includes('overview')) {
        structure.hasIntroduction = true;
      }
      if (lowerTitle.includes('conclusion') || lowerTitle.includes('summary')) {
        structure.hasConclusion = true;
      }
    });

    // Add remaining content to last section
    if (currentSection) {
      structure.sections.push(currentSection);
    }

    return structure;
  }

  extractImages($, baseUrl) {
    const images = [];
    
    $('img').each((i, elem) => {
      const src = $(elem).attr('src');
      const alt = $(elem).attr('alt') || '';
      
      if (src) {
        try {
          const imageUrl = new URL(src, baseUrl).href;
          images.push({
            url: imageUrl,
            alt: alt,
            title: $(elem).attr('title') || alt
          });
        } catch (error) {
          // Skip invalid image URLs
        }
      }
    });

    return images;
  }

  extractLinks($, baseUrl) {
    const links = [];
    
    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      const text = $(elem).text().trim();
      
      if (href && text) {
        try {
          const linkUrl = new URL(href, baseUrl).href;
          links.push({
            url: linkUrl,
            text: text,
            title: $(elem).attr('title') || text
          });
        } catch (error) {
          // Skip invalid URLs
        }
      }
    });

    return links;
  }

  cleanText(content) {
    let text = '';
    
    if (typeof content === 'string') {
      text = content;
    } else if (content.fullText) {
      text = content.fullText;
    } else if (content.paragraphs) {
      text = content.paragraphs.join('\n\n');
    }

    // Clean up the text
    return text
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
      .trim();
  }

  async scrapeMultipleUrls(urls) {
    const results = [];
    const maxConcurrent = 3; // Limit concurrent requests

    for (let i = 0; i < urls.length; i += maxConcurrent) {
      const batch = urls.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(async (url) => {
        try {
          const content = await this.scrapeUrl(url);
          return { success: true, url, content };
        } catch (error) {
          return { success: false, url, error: error.message };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to be respectful
      if (i + maxConcurrent < urls.length) {
        await this.delay(1000); // 1 second delay
      }
    }

    return results;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility method to extract specific content types
  extractSpecificContent($, type) {
    switch (type) {
      case 'news':
        return this.extractNewsContent($);
      case 'blog':
        return this.extractBlogContent($);
      case 'academic':
        return this.extractAcademicContent($);
      case 'product':
        return this.extractProductContent($);
      default:
        return this.extractMainContent($);
    }
  }

  extractNewsContent($) {
    // News-specific extraction logic
    const headline = $('h1, .headline, .title').first().text().trim();
    const byline = $('.byline, .author, [rel="author"]').first().text().trim();
    const dateline = $('.dateline, .published, time').first().text().trim();
    const leadParagraph = $('.lead, .summary, p').first().text().trim();
    
    return {
      headline,
      byline,
      dateline,
      leadParagraph,
      fullContent: this.extractMainContent($)
    };
  }

  extractBlogContent($) {
    // Blog-specific extraction logic
    const title = $('h1, .post-title, .entry-title').first().text().trim();
    const author = $('.author, .by-author, [rel="author"]').first().text().trim();
    const date = $('.date, .published, time').first().text().trim();
    
    return {
      title,
      author,
      date,
      content: this.extractMainContent($)
    };
  }

  extractAcademicContent($) {
    // Academic paper extraction logic
    const title = $('h1, .title').first().text().trim();
    const abstract = $('.abstract, .summary').first().text().trim();
    const authors = $('.authors, .author').map((i, el) => $(el).text().trim()).get();
    
    return {
      title,
      abstract,
      authors,
      content: this.extractMainContent($)
    };
  }

  extractProductContent($) {
    // Product page extraction logic
    const name = $('h1, .product-name, .product-title').first().text().trim();
    const price = $('.price, .cost, .amount').first().text().trim();
    const description = $('.description, .product-description').first().text().trim();
    const features = $('.features li, .specs li').map((i, el) => $(el).text().trim()).get();
    
    return {
      name,
      price,
      description,
      features,
      content: this.extractMainContent($)
    };
  }
}

module.exports = new URLScraper();