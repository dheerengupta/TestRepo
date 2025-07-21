const OpenAI = require('openai');
const natural = require('natural');

class AIService {
  constructor() {
    this.hasApiKey = !!process.env.OPENAI_API_KEY;
    
    if (this.hasApiKey) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      console.warn('⚠️  OpenAI API key not found. AI features will return demo content.');
      this.openai = null;
    }
    this.tokenizer = natural.WordTokenizer;
  }

  async generateContentFromTopic(topic, slideCount = 10) {
    try {
      // Return demo content if no API key
      if (!this.hasApiKey) {
        return this.getDemoContent(topic, slideCount);
      }
      
      const prompt = `Create a comprehensive presentation outline for the topic: "${topic}".
      
      Requirements:
      - Generate content for ${slideCount} slides
      - Include a compelling title slide
      - Provide 3-5 key points per content slide
      - Include relevant statistics, facts, or examples where appropriate
      - Suggest appropriate visuals or charts for each slide
      - End with a strong conclusion/call-to-action slide
      
      Format the response as a JSON object with the following structure:
      {
        "title": "Presentation Title",
        "slides": [
          {
            "slideNumber": 1,
            "type": "title",
            "title": "Main Title",
            "subtitle": "Subtitle or tagline",
            "speakerNotes": "Notes for the presenter"
          },
          {
            "slideNumber": 2,
            "type": "content",
            "title": "Slide Title",
            "bulletPoints": ["Point 1", "Point 2", "Point 3"],
            "visualSuggestion": "Description of suggested visual",
            "speakerNotes": "Detailed notes for the presenter"
          }
        ]
      }`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert presentation designer and content creator. Create engaging, professional presentation content that is well-structured and visually appealing."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      });

      const content = completion.choices[0].message.content;
      return this.parseAIResponse(content);

    } catch (error) {
      console.error('Error generating content from topic:', error);
      throw new Error('Failed to generate AI content');
    }
  }

  async processDocumentContent(extractedText) {
    try {
      // Return demo content if no API key
      if (!this.hasApiKey) {
        return this.getDemoContent("Document Content Analysis", 5);
      }
      
      const prompt = `Analyze and summarize the following document content for a presentation:

      "${extractedText}"

      Requirements:
      - Identify the main themes and key points
      - Create a logical flow for presentation slides
      - Suggest 8-12 slides based on the content
      - Extract important statistics, quotes, or facts
      - Recommend visual elements for each section

      Format as JSON with the same structure as generateContentFromTopic.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing documents and creating presentation content. Extract the most important information and structure it for maximum impact."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.6
      });

      const content = completion.choices[0].message.content;
      return this.parseAIResponse(content);

    } catch (error) {
      console.error('Error processing document content:', error);
      throw new Error('Failed to process document with AI');
    }
  }

  async processWebContent(webContent) {
    try {
      // Return demo content if no API key
      if (!this.hasApiKey) {
        return this.getDemoContent("Web Content Analysis", 5);
      }
      const prompt = `Create a presentation from the following web content:

      Title: ${webContent.title}
      Content: ${webContent.text}
      URL: ${webContent.url}

      Requirements:
      - Focus on the main message and key insights
      - Create 6-10 slides that tell a compelling story
      - Include the source URL for credibility
      - Suggest relevant visuals based on the content type
      - Make it engaging and professional

      Format as JSON with the same structure as generateContentFromTopic.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at transforming web content into engaging presentations. Focus on clarity, impact, and visual appeal."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      });

      const content = completion.choices[0].message.content;
      return this.parseAIResponse(content);

    } catch (error) {
      console.error('Error processing web content:', error);
      throw new Error('Failed to process web content with AI');
    }
  }

  async enhanceSlideContent(slideContent, template) {
    try {
      const prompt = `Enhance the following slide content for better presentation impact:

      Slide: ${JSON.stringify(slideContent)}
      Template: ${template}

      Requirements:
      - Improve clarity and engagement
      - Optimize for the specified template style
      - Suggest better visual elements
      - Enhance speaker notes
      - Maintain the core message

      Return the enhanced slide in the same JSON format.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a presentation enhancement specialist. Improve content while maintaining its essence."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.5
      });

      const content = completion.choices[0].message.content;
      return this.parseAIResponse(content);

    } catch (error) {
      console.error('Error enhancing slide content:', error);
      return slideContent; // Return original if enhancement fails
    }
  }

  async generateVisualSuggestions(slideContent) {
    try {
      // Return demo content if no API key
      if (!this.hasApiKey) {
        return this.getDemoVisualSuggestions();
      }
      const prompt = `Based on this slide content, suggest specific visual elements:

      "${JSON.stringify(slideContent)}"

      Provide suggestions for:
      - Stock photo keywords
      - Icon types
      - Chart/graph types if applicable
      - Color scheme recommendations
      - Layout suggestions

      Return as a JSON object with visual recommendations.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a visual design expert specializing in presentation graphics and layout."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.6
      });

      const content = completion.choices[0].message.content;
      return this.parseAIResponse(content);

    } catch (error) {
      console.error('Error generating visual suggestions:', error);
      return {
        stockPhotoKeywords: ['business', 'professional'],
        iconType: 'modern',
        colorScheme: 'professional',
        layout: 'standard'
      };
    }
  }

  parseAIResponse(content) {
    try {
      // Remove any markdown code blocks
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Return a basic structure if parsing fails
      return {
        title: "Generated Presentation",
        slides: [
          {
            slideNumber: 1,
            type: "title",
            title: "Presentation Title",
            subtitle: "Generated by SlideCraft",
            speakerNotes: "Welcome to your presentation"
          }
        ]
      };
    }
  }

  async summarizeText(text, maxLength = 500) {
    try {
      const prompt = `Summarize the following text in ${maxLength} characters or less:

      "${text}"

      Focus on the main points and key insights.`;

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at creating concise, impactful summaries."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.5
      });

      return completion.choices[0].message.content.trim();

    } catch (error) {
      console.error('Error summarizing text:', error);
      return text.substring(0, maxLength) + '...';
    }
  }

  extractKeywords(text) {
    const tokens = new this.tokenizer().tokenize(text.toLowerCase());
    const stopWords = natural.stopwords;
    
    // Filter out stop words and short words
    const keywords = tokens.filter(token => 
      !stopWords.includes(token) && 
      token.length > 3 && 
      /^[a-zA-Z]+$/.test(token)
    );

    // Get word frequency
    const frequency = {};
    keywords.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  // Demo content for when API key is not available
  getDemoContent(topic, slideCount = 10) {
    const demoSlides = [
      {
        slideNumber: 1,
        type: "title",
        title: `${topic}`,
        subtitle: "A Comprehensive Overview",
        speakerNotes: `Welcome to this presentation on ${topic}. This is demo content generated without an API key.`
      },
      {
        slideNumber: 2,
        type: "content",
        title: "Introduction",
        bulletPoints: [
          `Understanding the fundamentals of ${topic}`,
          "Key concepts and terminology",
          "Current state and trends",
          "Why this topic matters today"
        ],
        visualSuggestion: "Infographic showing key statistics",
        speakerNotes: `This slide introduces the basic concepts of ${topic} and sets the context for the presentation.`
      },
      {
        slideNumber: 3,
        type: "content",
        title: "Key Benefits",
        bulletPoints: [
          "Improved efficiency and productivity",
          "Cost-effective solutions",
          "Enhanced user experience",
          "Future-ready approach"
        ],
        visualSuggestion: "Chart showing benefits comparison",
        speakerNotes: "Highlight the main advantages and positive impacts."
      },
      {
        slideNumber: 4,
        type: "content",
        title: "Implementation Strategy",
        bulletPoints: [
          "Phase 1: Planning and preparation",
          "Phase 2: Pilot testing",
          "Phase 3: Full deployment",
          "Phase 4: Monitoring and optimization"
        ],
        visualSuggestion: "Timeline or process flow diagram",
        speakerNotes: "Break down the implementation into manageable phases."
      },
      {
        slideNumber: 5,
        type: "content",
        title: "Conclusion",
        bulletPoints: [
          `${topic} offers significant opportunities`,
          "Implementation requires careful planning",
          "Success depends on stakeholder engagement",
          "The future looks promising"
        ],
        visualSuggestion: "Summary infographic",
        speakerNotes: "Wrap up the key points and provide a call to action."
      }
    ];

    return {
      title: `${topic} - Demo Presentation`,
      slides: demoSlides.slice(0, Math.min(slideCount, 5)),
      metadata: {
        isDemo: true,
        message: "🔑 This is demo content. Add your OpenAI API key for AI-generated presentations!"
      }
    };
  }

  getDemoVisualSuggestions() {
    return [
      {
        type: "chart",
        description: "Bar chart showing growth trends",
        placement: "center"
      },
      {
        type: "infographic",
        description: "Process flow diagram",
        placement: "full-slide"
      },
      {
        type: "image",
        description: "Professional stock photo",
        placement: "right-side"
      }
    ];
  }
}

module.exports = new AIService();