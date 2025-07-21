const PptxGenJS = require('pptxgenjs');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class PresentationGenerator {
  constructor() {
    this.presentations = new Map(); // In-memory storage for demo
    this.templates = this.initializeTemplates();
  }

  initializeTemplates() {
    return {
      professional: {
        name: 'Professional',
        description: 'Clean, modern design for business presentations',
        colors: {
          primary: '#2E4B8A',
          secondary: '#F5F7FA',
          accent: '#FF6B35',
          text: '#333333'
        },
        fonts: {
          title: { face: 'Calibri', size: 44, bold: true },
          subtitle: { face: 'Calibri', size: 24 },
          content: { face: 'Calibri', size: 20 },
          notes: { face: 'Calibri', size: 14 }
        },
        layout: {
          titleSlide: { titleY: 2.5, subtitleY: 4.0 },
          contentSlide: { titleY: 0.5, contentY: 1.5 }
        }
      },
      corporate: {
        name: 'Corporate',
        description: 'Formal design for executive presentations',
        colors: {
          primary: '#1B365D',
          secondary: '#E8F1F8',
          accent: '#0066CC',
          text: '#2C3E50'
        },
        fonts: {
          title: { face: 'Arial', size: 42, bold: true },
          subtitle: { face: 'Arial', size: 22 },
          content: { face: 'Arial', size: 18 },
          notes: { face: 'Arial', size: 12 }
        },
        layout: {
          titleSlide: { titleY: 2.0, subtitleY: 3.5 },
          contentSlide: { titleY: 0.3, contentY: 1.2 }
        }
      },
      creative: {
        name: 'Creative',
        description: 'Vibrant design for creative and marketing presentations',
        colors: {
          primary: '#E74C3C',
          secondary: '#FDF2E9',
          accent: '#F39C12',
          text: '#34495E'
        },
        fonts: {
          title: { face: 'Montserrat', size: 48, bold: true },
          subtitle: { face: 'Open Sans', size: 26 },
          content: { face: 'Open Sans', size: 22 },
          notes: { face: 'Open Sans', size: 14 }
        },
        layout: {
          titleSlide: { titleY: 3.0, subtitleY: 4.5 },
          contentSlide: { titleY: 0.7, contentY: 1.8 }
        }
      },
      academic: {
        name: 'Academic',
        description: 'Traditional design for educational presentations',
        colors: {
          primary: '#2C3E50',
          secondary: '#ECF0F1',
          accent: '#3498DB',
          text: '#2C3E50'
        },
        fonts: {
          title: { face: 'Times New Roman', size: 40, bold: true },
          subtitle: { face: 'Times New Roman', size: 24 },
          content: { face: 'Times New Roman', size: 20 },
          notes: { face: 'Times New Roman', size: 14 }
        },
        layout: {
          titleSlide: { titleY: 2.2, subtitleY: 3.8 },
          contentSlide: { titleY: 0.4, contentY: 1.4 }
        }
      }
    };
  }

  async createPresentation(content, templateName = 'professional', customizations = {}) {
    try {
      const presentationId = uuidv4();
      const template = this.templates[templateName] || this.templates.professional;
      
      // Apply customizations to template
      const finalTemplate = this.applyCustomizations(template, customizations);
      
      // Create PowerPoint presentation
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'SlideCraft';
      pptx.company = 'SlideCraft AI';
      pptx.title = content.title;
      pptx.subject = 'AI-Generated Presentation';

      // Generate slides
      const slides = [];
      for (let i = 0; i < content.slides.length; i++) {
        const slideData = content.slides[i];
        const slide = await this.createSlide(pptx, slideData, finalTemplate, i);
        slides.push(slideData);
      }

      // Store presentation data
      const presentation = {
        id: presentationId,
        title: content.title,
        slides: slides,
        template: templateName,
        customizations: customizations,
        pptx: pptx,
        createdAt: new Date().toISOString(),
        metadata: content.metadata || {}
      };

      this.presentations.set(presentationId, presentation);
      
      return presentation;

    } catch (error) {
      console.error('Error creating presentation:', error);
      throw new Error('Failed to create presentation');
    }
  }

  async createSlide(pptx, slideData, template, slideIndex) {
    const slide = pptx.addSlide();
    
    // Set slide background
    slide.background = { color: template.colors.secondary };

    switch (slideData.type) {
      case 'title':
        await this.createTitleSlide(slide, slideData, template);
        break;
      case 'content':
        await this.createContentSlide(slide, slideData, template);
        break;
      case 'conclusion':
        await this.createConclusionSlide(slide, slideData, template);
        break;
      default:
        await this.createContentSlide(slide, slideData, template);
    }

    // Add slide number
    slide.addText(`${slideIndex + 1}`, {
      x: 9.5, y: 7.0, w: 0.5, h: 0.3,
      fontSize: 12,
      color: template.colors.text,
      align: 'center'
    });

    return slide;
  }

  async createTitleSlide(slide, slideData, template) {
    // Main title
    slide.addText(slideData.title, {
      x: 1, y: template.layout.titleSlide.titleY, w: 8, h: 1.5,
      fontSize: template.fonts.title.size,
      fontFace: template.fonts.title.face,
      bold: template.fonts.title.bold,
      color: template.colors.primary,
      align: 'center',
      valign: 'middle'
    });

    // Subtitle
    if (slideData.subtitle) {
      slide.addText(slideData.subtitle, {
        x: 1, y: template.layout.titleSlide.subtitleY, w: 8, h: 1,
        fontSize: template.fonts.subtitle.size,
        fontFace: template.fonts.subtitle.face,
        color: template.colors.text,
        align: 'center',
        valign: 'middle'
      });
    }

    // Add decorative element
    slide.addShape(pptx.ShapeType.rect, {
      x: 2, y: 5.5, w: 6, h: 0.1,
      fill: { color: template.colors.accent }
    });
  }

  async createContentSlide(slide, slideData, template) {
    // Slide title
    slide.addText(slideData.title, {
      x: 0.5, y: template.layout.contentSlide.titleY, w: 9, h: 0.8,
      fontSize: template.fonts.title.size * 0.7,
      fontFace: template.fonts.title.face,
      bold: true,
      color: template.colors.primary,
      align: 'left',
      valign: 'middle'
    });

    // Title underline
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5, y: template.layout.contentSlide.titleY + 0.7, w: 9, h: 0.05,
      fill: { color: template.colors.accent }
    });

    // Content area
    let contentY = template.layout.contentSlide.contentY;

    if (slideData.bulletPoints && slideData.bulletPoints.length > 0) {
      // Create bullet points
      const bulletText = slideData.bulletPoints.map(point => `• ${point}`).join('\n');
      
      slide.addText(bulletText, {
        x: 0.8, y: contentY, w: 8.5, h: 5,
        fontSize: template.fonts.content.size,
        fontFace: template.fonts.content.face,
        color: template.colors.text,
        align: 'left',
        valign: 'top',
        lineSpacing: 32
      });
    }

    // Add visual placeholder if suggested
    if (slideData.visualSuggestion) {
      this.addVisualPlaceholder(slide, slideData.visualSuggestion, template);
    }
  }

  async createConclusionSlide(slide, slideData, template) {
    // Similar to content slide but with emphasis
    slide.addText(slideData.title, {
      x: 0.5, y: 1, w: 9, h: 1,
      fontSize: template.fonts.title.size * 0.8,
      fontFace: template.fonts.title.face,
      bold: true,
      color: template.colors.primary,
      align: 'center',
      valign: 'middle'
    });

    if (slideData.bulletPoints && slideData.bulletPoints.length > 0) {
      const bulletText = slideData.bulletPoints.map(point => `• ${point}`).join('\n');
      
      slide.addText(bulletText, {
        x: 1, y: 2.5, w: 8, h: 4,
        fontSize: template.fonts.content.size * 1.1,
        fontFace: template.fonts.content.face,
        color: template.colors.text,
        align: 'center',
        valign: 'top',
        lineSpacing: 36
      });
    }

    // Add call-to-action box
    slide.addShape(pptx.ShapeType.rect, {
      x: 2, y: 6, w: 6, h: 0.8,
      fill: { color: template.colors.accent },
      line: { color: template.colors.primary, width: 2 }
    });

    slide.addText('Thank You!', {
      x: 2, y: 6, w: 6, h: 0.8,
      fontSize: 24,
      fontFace: template.fonts.title.face,
      bold: true,
      color: 'FFFFFF',
      align: 'center',
      valign: 'middle'
    });
  }

  addVisualPlaceholder(slide, visualSuggestion, template) {
    // Add a placeholder for visual content
    slide.addShape(pptx.ShapeType.rect, {
      x: 6, y: 2, w: 3.5, h: 2.5,
      fill: { color: template.colors.secondary },
      line: { color: template.colors.accent, width: 2, dashType: 'dash' }
    });

    slide.addText(`Visual:\n${visualSuggestion}`, {
      x: 6.2, y: 2.2, w: 3.1, h: 2.1,
      fontSize: 12,
      fontFace: template.fonts.notes.face,
      color: template.colors.text,
      align: 'center',
      valign: 'middle',
      italic: true
    });
  }

  applyCustomizations(template, customizations) {
    const customizedTemplate = JSON.parse(JSON.stringify(template));

    if (customizations.colors) {
      Object.assign(customizedTemplate.colors, customizations.colors);
    }

    if (customizations.fonts) {
      Object.assign(customizedTemplate.fonts, customizations.fonts);
    }

    if (customizations.layout) {
      Object.assign(customizedTemplate.layout, customizations.layout);
    }

    return customizedTemplate;
  }

  async exportPresentation(presentationId, format = 'pptx') {
    try {
      const presentation = this.presentations.get(presentationId);
      if (!presentation) {
        throw new Error('Presentation not found');
      }

      const fileName = `presentation_${presentationId}.${format}`;
      const filePath = path.join(process.cwd(), 'uploads', fileName);

      switch (format) {
        case 'pptx':
          await presentation.pptx.writeFile(filePath);
          break;
        case 'pdf':
          // For PDF export, we'd need additional libraries
          // For now, export as PPTX
          await presentation.pptx.writeFile(filePath.replace('.pdf', '.pptx'));
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      return filePath;

    } catch (error) {
      console.error('Error exporting presentation:', error);
      throw new Error('Failed to export presentation');
    }
  }

  async getTemplates() {
    return Object.entries(this.templates).map(([key, template]) => ({
      id: key,
      name: template.name,
      description: template.description,
      preview: this.generateTemplatePreview(template)
    }));
  }

  generateTemplatePreview(template) {
    return {
      primaryColor: template.colors.primary,
      secondaryColor: template.colors.secondary,
      accentColor: template.colors.accent,
      fontFamily: template.fonts.title.face,
      style: 'modern'
    };
  }

  async updatePresentation(presentationId, slides, template, customizations) {
    try {
      const presentation = this.presentations.get(presentationId);
      if (!presentation) {
        throw new Error('Presentation not found');
      }

      // Update presentation data
      presentation.slides = slides;
      presentation.template = template;
      presentation.customizations = customizations;
      presentation.updatedAt = new Date().toISOString();

      // Regenerate PowerPoint
      const content = {
        title: presentation.title,
        slides: slides
      };

      const updatedPresentation = await this.createPresentation(
        content, 
        template, 
        customizations
      );

      // Replace the old presentation
      this.presentations.set(presentationId, {
        ...presentation,
        pptx: updatedPresentation.pptx
      });

      return presentation;

    } catch (error) {
      console.error('Error updating presentation:', error);
      throw new Error('Failed to update presentation');
    }
  }

  async getHistory() {
    const history = Array.from(this.presentations.values()).map(presentation => ({
      id: presentation.id,
      title: presentation.title,
      template: presentation.template,
      slideCount: presentation.slides.length,
      createdAt: presentation.createdAt,
      updatedAt: presentation.updatedAt
    }));

    return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async deletePresentation(presentationId) {
    return this.presentations.delete(presentationId);
  }

  async getPresentation(presentationId) {
    return this.presentations.get(presentationId);
  }

  // Utility method to add charts (for future enhancement)
  addChart(slide, chartData, template) {
    // This would be implemented to add various chart types
    // based on the chartData and template specifications
    slide.addChart(pptx.ChartType.bar, chartData, {
      x: 1, y: 2, w: 8, h: 4,
      chartColors: [template.colors.primary, template.colors.accent]
    });
  }

  // Utility method to add images (for future enhancement)
  async addImage(slide, imagePath, options) {
    try {
      slide.addImage({
        path: imagePath,
        x: options.x || 1,
        y: options.y || 2,
        w: options.w || 4,
        h: options.h || 3
      });
    } catch (error) {
      console.error('Error adding image:', error);
    }
  }
}

module.exports = new PresentationGenerator();