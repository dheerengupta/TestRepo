// SlideCraft Frontend Application
class SlideCraftApp {
    constructor() {
        this.currentPresentation = null;
        this.currentSlideIndex = 0;
        this.isGenerating = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTemplates();
        this.setupFileUpload();
        this.setupMethodTabs();
        this.setupCharacterCount();
        this.setupModals();
    }

    setupEventListeners() {
        // Generate buttons
        document.getElementById('generateFromTopic').addEventListener('click', () => {
            this.generateFromTopic();
        });

        document.getElementById('generateFromDocument').addEventListener('click', () => {
            this.generateFromDocument();
        });

        document.getElementById('generateFromUrl').addEventListener('click', () => {
            this.generateFromUrl();
        });

        // Download and action buttons
        document.getElementById('downloadPptx').addEventListener('click', () => {
            this.downloadPresentation('pptx');
        });

        document.getElementById('editPresentation').addEventListener('click', () => {
            this.toggleCustomizationPanel();
        });

        document.getElementById('saveToCloud').addEventListener('click', () => {
            this.showCloudSaveModal();
        });

        document.getElementById('sharePresentation').addEventListener('click', () => {
            this.sharePresentation();
        });

        document.getElementById('applyCustomizations').addEventListener('click', () => {
            this.applyCustomizations();
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToSection(link.getAttribute('href'));
            });
        });

        // Cloud save options
        document.querySelectorAll('.cloud-option').forEach(option => {
            option.addEventListener('click', () => {
                this.saveToCloudService(option.dataset.service);
            });
        });

        // Input validation
        document.getElementById('topicInput').addEventListener('input', () => {
            this.validateTopicInput();
        });

        document.getElementById('urlInput').addEventListener('input', () => {
            this.validateUrlInput();
        });
    }

    setupMethodTabs() {
        const tabs = document.querySelectorAll('.method-tab');
        const methods = document.querySelectorAll('.input-method');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const method = tab.dataset.method;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active method
                methods.forEach(m => m.classList.remove('active'));
                document.querySelector(`[data-method="${method}"]`).classList.add('active');
            });
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('documentInput');
        const uploadLink = document.querySelector('.upload-link');
        const generateBtn = document.getElementById('generateFromDocument');

        // Click to upload
        uploadLink.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelection(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelection(e.target.files[0]);
            }
        });
    }

    handleFileSelection(file) {
        const uploadArea = document.getElementById('uploadArea');
        const generateBtn = document.getElementById('generateFromDocument');
        
        // Validate file
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'application/msword', 
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'text/plain'];

        if (file.size > maxSize) {
            this.showError('File size must be less than 10MB');
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            this.showError('Please upload a PDF, Word document, or text file');
            return;
        }

        // Update UI
        uploadArea.innerHTML = `
            <div class="upload-content">
                <i class="fas fa-file-check"></i>
                <h4>${file.name}</h4>
                <p>File ready for upload</p>
                <small>${this.formatFileSize(file.size)}</small>
            </div>
        `;

        generateBtn.disabled = false;
    }

    setupCharacterCount() {
        const topicInput = document.getElementById('topicInput');
        const charCount = document.querySelector('.char-count');

        topicInput.addEventListener('input', () => {
            const length = topicInput.value.length;
            const maxLength = topicInput.getAttribute('maxlength');
            charCount.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.9) {
                charCount.style.color = 'var(--warning-color)';
            } else {
                charCount.style.color = 'var(--text-light)';
            }
        });
    }

    setupModals() {
        // Modal close handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.dataset.modal;
                this.hideModal(modalId);
            });
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    async generateFromTopic() {
        if (this.isGenerating) return;

        const topic = document.getElementById('topicInput').value.trim();
        const slideCount = document.getElementById('slideCount').value;
        const template = document.getElementById('topicTemplate').value;

        if (!topic) {
            this.showError('Please enter a topic for your presentation');
            return;
        }

        this.isGenerating = true;
        this.showLoadingState('Generating presentation from topic...');

        try {
            const response = await fetch('/api/generate-from-topic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic,
                    slideCount: parseInt(slideCount),
                    template,
                    customizations: {}
                })
            });

            const result = await response.json();

            if (result.success) {
                this.currentPresentation = result;
                this.showResults(result);
            } else {
                this.showError(result.error || 'Failed to generate presentation');
            }
        } catch (error) {
            console.error('Error generating presentation:', error);
            this.showError('Failed to generate presentation. Please try again.');
        } finally {
            this.isGenerating = false;
            this.hideLoadingState();
        }
    }

    async generateFromDocument() {
        if (this.isGenerating) return;

        const fileInput = document.getElementById('documentInput');
        const template = document.getElementById('docTemplate').value;

        if (!fileInput.files.length) {
            this.showError('Please select a document to upload');
            return;
        }

        this.isGenerating = true;
        this.showLoadingState('Processing document and generating slides...');

        try {
            const formData = new FormData();
            formData.append('document', fileInput.files[0]);
            formData.append('template', template);
            formData.append('customizations', JSON.stringify({}));

            const response = await fetch('/api/generate-from-document', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.currentPresentation = result;
                this.showResults(result);
            } else {
                this.showError(result.error || 'Failed to process document');
            }
        } catch (error) {
            console.error('Error processing document:', error);
            this.showError('Failed to process document. Please try again.');
        } finally {
            this.isGenerating = false;
            this.hideLoadingState();
        }
    }

    async generateFromUrl() {
        if (this.isGenerating) return;

        const url = document.getElementById('urlInput').value.trim();
        const template = document.getElementById('urlTemplate').value;

        if (!url) {
            this.showError('Please enter a valid URL');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showError('Please enter a valid HTTP or HTTPS URL');
            return;
        }

        this.isGenerating = true;
        this.showLoadingState('Scraping content and generating slides...');

        try {
            const response = await fetch('/api/generate-from-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url,
                    template,
                    customizations: {}
                })
            });

            const result = await response.json();

            if (result.success) {
                this.currentPresentation = result;
                this.showResults(result);
            } else {
                this.showError(result.error || 'Failed to process URL');
            }
        } catch (error) {
            console.error('Error processing URL:', error);
            this.showError('Failed to process URL. Please try again.');
        } finally {
            this.isGenerating = false;
            this.hideLoadingState();
        }
    }

    showLoadingState(message) {
        const loadingSection = document.getElementById('loadingSection');
        const loadingTitle = document.getElementById('loadingTitle');
        const loadingDescription = document.getElementById('loadingDescription');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        loadingTitle.textContent = message;
        loadingDescription.textContent = 'This may take a few moments...';
        
        // Animate progress bar
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 90) progress = 90;
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }, 500);

        loadingSection.style.display = 'block';
        loadingSection.scrollIntoView({ behavior: 'smooth' });

        // Store interval for cleanup
        this.progressInterval = progressInterval;
    }

    hideLoadingState() {
        const loadingSection = document.getElementById('loadingSection');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }

        // Complete progress
        progressFill.style.width = '100%';
        progressText.textContent = '100%';

        setTimeout(() => {
            loadingSection.style.display = 'none';
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
        }, 1000);
    }

    showResults(presentation) {
        const resultsSection = document.getElementById('resultsSection');
        const slidesPreview = document.getElementById('slidesPreview');
        const presentationTitle = document.getElementById('presentationTitle');
        const slideCountDisplay = document.getElementById('slideCountDisplay');
        const estimatedTime = document.getElementById('estimatedTime');
        const templateDisplay = document.getElementById('templateDisplay');

        // Update presentation info
        presentationTitle.textContent = presentation.slides[0]?.title || 'Generated Presentation';
        slideCountDisplay.textContent = presentation.slides.length;
        estimatedTime.textContent = this.calculateEstimatedTime(presentation.slides);
        templateDisplay.textContent = this.capitalizeFirst(presentation.template || 'Professional');

        // Render slide previews
        this.renderSlidesPreviews(presentation.slides, slidesPreview);

        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    renderSlidesPreviews(slides, container) {
        container.innerHTML = '';

        slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide-thumbnail';
            slideElement.dataset.slideIndex = index;

            let content = '';
            if (slide.bulletPoints && slide.bulletPoints.length > 0) {
                content = `
                    <ul>
                        ${slide.bulletPoints.slice(0, 4).map(point => `<li>${point}</li>`).join('')}
                        ${slide.bulletPoints.length > 4 ? '<li>...</li>' : ''}
                    </ul>
                `;
            } else if (slide.subtitle) {
                content = `<p>${slide.subtitle}</p>`;
            }

            slideElement.innerHTML = `
                <div class="slide-number">Slide ${index + 1}</div>
                <div class="slide-title">${slide.title}</div>
                <div class="slide-content">${content}</div>
            `;

            slideElement.addEventListener('click', () => {
                this.selectSlide(index);
            });

            container.appendChild(slideElement);
        });

        // Select first slide
        this.selectSlide(0);
    }

    selectSlide(index) {
        const thumbnails = document.querySelectorAll('.slide-thumbnail');
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        if (thumbnails[index]) {
            thumbnails[index].classList.add('active');
            this.currentSlideIndex = index;
        }
    }

    async downloadPresentation(format = 'pptx') {
        if (!this.currentPresentation) {
            this.showError('No presentation to download');
            return;
        }

        try {
            const response = await fetch(`/api/download/${this.currentPresentation.presentationId}?format=${format}`);
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `presentation.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                this.showError('Failed to download presentation');
            }
        } catch (error) {
            console.error('Download error:', error);
            this.showError('Failed to download presentation');
        }
    }

    toggleCustomizationPanel() {
        const panel = document.getElementById('customizationPanel');
        const isVisible = panel.style.display !== 'none';
        panel.style.display = isVisible ? 'none' : 'block';
    }

    async applyCustomizations() {
        if (!this.currentPresentation) return;

        const template = document.getElementById('templateCustomizer').value;
        const primaryColor = document.getElementById('primaryColor').value;
        const fontFamily = document.getElementById('fontFamily').value;

        const customizations = {
            colors: {
                primary: primaryColor
            },
            fonts: {
                title: { face: fontFamily },
                content: { face: fontFamily }
            }
        };

        try {
            const response = await fetch(`/api/presentations/${this.currentPresentation.presentationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    slides: this.currentPresentation.slides,
                    template,
                    customizations
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess('Customizations applied successfully!');
                this.currentPresentation.template = template;
            } else {
                this.showError('Failed to apply customizations');
            }
        } catch (error) {
            console.error('Customization error:', error);
            this.showError('Failed to apply customizations');
        }
    }

    showCloudSaveModal() {
        this.showModal('cloudSaveModal');
    }

    async saveToCloudService(service) {
        if (!this.currentPresentation) {
            this.showError('No presentation to save');
            return;
        }

        this.hideModal('cloudSaveModal');

        try {
            // In a real implementation, you would handle OAuth flow here
            this.showError('Cloud save feature requires authentication setup. Please use the download option for now.');
        } catch (error) {
            console.error('Cloud save error:', error);
            this.showError('Failed to save to cloud storage');
        }
    }

    async sharePresentation() {
        if (!this.currentPresentation) {
            this.showError('No presentation to share');
            return;
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SlideCraft Presentation',
                    text: 'Check out this presentation created with SlideCraft',
                    url: window.location.href
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                this.showSuccess('Presentation link copied to clipboard!');
            }).catch(() => {
                this.showError('Failed to copy link');
            });
        }
    }

    async loadTemplates() {
        try {
            const response = await fetch('/api/templates');
            const data = await response.json();
            
            if (data.templates) {
                this.renderTemplates(data.templates);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    }

    renderTemplates(templates) {
        const container = document.getElementById('templatesGrid');
        if (!container) return;

        container.innerHTML = templates.map(template => `
            <div class="template-card" data-template="${template.id}">
                <div class="template-preview" style="background: linear-gradient(135deg, ${template.preview.primaryColor}, ${template.preview.accentColor});">
                </div>
                <div class="template-info">
                    <h3>${template.name}</h3>
                    <p>${template.description}</p>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const templateId = card.dataset.template;
                this.selectTemplate(templateId);
            });
        });
    }

    selectTemplate(templateId) {
        // Update all template selectors
        const selectors = ['topicTemplate', 'docTemplate', 'urlTemplate', 'templateCustomizer'];
        selectors.forEach(selectorId => {
            const selector = document.getElementById(selectorId);
            if (selector) {
                selector.value = templateId;
            }
        });

        this.showSuccess(`${this.capitalizeFirst(templateId)} template selected!`);
    }

    // Validation methods
    validateTopicInput() {
        const input = document.getElementById('topicInput');
        const button = document.getElementById('generateFromTopic');
        
        button.disabled = input.value.trim().length < 3;
    }

    validateUrlInput() {
        const input = document.getElementById('urlInput');
        const button = document.getElementById('generateFromUrl');
        
        button.disabled = !this.isValidUrl(input.value.trim());
    }

    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    // Modal methods
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Notification methods
    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        this.showModal('errorModal');
    }

    showSuccess(message) {
        // Create temporary success notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility methods
    scrollToSection(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    calculateEstimatedTime(slides) {
        const baseTimePerSlide = 45; // seconds
        const totalSeconds = slides.length * baseTimePerSlide;
        const minutes = Math.ceil(totalSeconds / 60);
        return `${minutes} min`;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SlideCraftApp();
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}