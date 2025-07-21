const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

class CloudStorage {
  constructor() {
    this.googleAuth = null;
    this.microsoftAuth = null;
  }

  async savePresentation(presentationId, service, accessToken) {
    try {
      switch (service.toLowerCase()) {
        case 'google':
        case 'googledrive':
          return await this.saveToGoogleDrive(presentationId, accessToken);
        case 'microsoft':
        case 'onedrive':
          return await this.saveToOneDrive(presentationId, accessToken);
        case 'googleslides':
          return await this.saveToGoogleSlides(presentationId, accessToken);
        default:
          throw new Error(`Unsupported cloud service: ${service}`);
      }
    } catch (error) {
      console.error('Error saving to cloud storage:', error);
      throw new Error(`Failed to save to ${service}: ${error.message}`);
    }
  }

  async saveToGoogleDrive(presentationId, accessToken) {
    try {
      // Set up Google Drive API client
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      // Get the presentation file
      const presentationGenerator = require('./presentationGenerator');
      const filePath = await presentationGenerator.exportPresentation(presentationId, 'pptx');
      const presentation = await presentationGenerator.getPresentation(presentationId);

      // Read the file
      const fileBuffer = await fs.readFile(filePath);

      // Upload to Google Drive
      const fileMetadata = {
        name: `${presentation.title || 'Presentation'}.pptx`,
        parents: ['1234567890'] // You can specify a folder ID here
      };

      const media = {
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        body: fileBuffer
      };

      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id,name,webViewLink,webContentLink'
      });

      // Clean up local file
      await fs.unlink(filePath).catch(() => {});

      return {
        success: true,
        service: 'Google Drive',
        fileId: response.data.id,
        fileName: response.data.name,
        url: response.data.webViewLink,
        downloadUrl: response.data.webContentLink
      };

    } catch (error) {
      console.error('Error saving to Google Drive:', error);
      throw new Error('Failed to save to Google Drive');
    }
  }

  async saveToOneDrive(presentationId, accessToken) {
    try {
      // Microsoft Graph API implementation
      const axios = require('axios');
      
      // Get the presentation file
      const presentationGenerator = require('./presentationGenerator');
      const filePath = await presentationGenerator.exportPresentation(presentationId, 'pptx');
      const presentation = await presentationGenerator.getPresentation(presentationId);

      // Read the file
      const fileBuffer = await fs.readFile(filePath);
      const fileName = `${presentation.title || 'Presentation'}.pptx`;

      // Upload to OneDrive
      const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`;
      
      const response = await axios.put(uploadUrl, fileBuffer, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        }
      });

      // Clean up local file
      await fs.unlink(filePath).catch(() => {});

      return {
        success: true,
        service: 'OneDrive',
        fileId: response.data.id,
        fileName: response.data.name,
        url: response.data.webUrl,
        downloadUrl: response.data['@microsoft.graph.downloadUrl']
      };

    } catch (error) {
      console.error('Error saving to OneDrive:', error);
      throw new Error('Failed to save to OneDrive');
    }
  }

  async saveToGoogleSlides(presentationId, accessToken) {
    try {
      // Set up Google Slides API client
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      
      const slides = google.slides({ version: 'v1', auth: oauth2Client });
      const presentationGenerator = require('./presentationGenerator');
      const presentation = await presentationGenerator.getPresentation(presentationId);

      // Create a new Google Slides presentation
      const createResponse = await slides.presentations.create({
        resource: {
          title: presentation.title || 'SlideCraft Presentation'
        }
      });

      const googleSlidesId = createResponse.data.presentationId;
      const requests = [];

      // Convert our slides to Google Slides format
      for (let i = 0; i < presentation.slides.length; i++) {
        const slideData = presentation.slides[i];
        
        if (i === 0) {
          // Update the first slide (title slide)
          requests.push({
            replaceAllText: {
              containsText: {
                text: '{{title}}',
                matchCase: false
              },
              replaceText: slideData.title || 'Title'
            }
          });

          if (slideData.subtitle) {
            requests.push({
              replaceAllText: {
                containsText: {
                  text: '{{subtitle}}',
                  matchCase: false
                },
                replaceText: slideData.subtitle
              }
            });
          }
        } else {
          // Add new slide
          requests.push({
            createSlide: {
              objectId: `slide_${i}`,
              slideLayoutReference: {
                predefinedLayout: 'TITLE_AND_BODY'
              }
            }
          });

          // Add title
          requests.push({
            insertText: {
              objectId: `slide_${i}_title`,
              text: slideData.title || `Slide ${i + 1}`
            }
          });

          // Add bullet points
          if (slideData.bulletPoints && slideData.bulletPoints.length > 0) {
            const bulletText = slideData.bulletPoints.join('\n');
            requests.push({
              insertText: {
                objectId: `slide_${i}_body`,
                text: bulletText
              }
            });
          }
        }
      }

      // Apply all changes
      if (requests.length > 0) {
        await slides.presentations.batchUpdate({
          presentationId: googleSlidesId,
          resource: {
            requests: requests
          }
        });
      }

      return {
        success: true,
        service: 'Google Slides',
        presentationId: googleSlidesId,
        url: `https://docs.google.com/presentation/d/${googleSlidesId}/edit`,
        viewUrl: `https://docs.google.com/presentation/d/${googleSlidesId}/present`
      };

    } catch (error) {
      console.error('Error saving to Google Slides:', error);
      throw new Error('Failed to save to Google Slides');
    }
  }

  async getGoogleAuthUrl() {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      const scopes = [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/presentations'
      ];

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
      });

      return authUrl;

    } catch (error) {
      console.error('Error generating Google auth URL:', error);
      throw new Error('Failed to generate Google authentication URL');
    }
  }

  async getMicrosoftAuthUrl() {
    try {
      const clientId = process.env.MICROSOFT_CLIENT_ID;
      const redirectUri = encodeURIComponent(process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3000/auth/microsoft/callback');
      const scopes = encodeURIComponent('Files.ReadWrite offline_access');

      const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${redirectUri}&` +
        `scope=${scopes}&` +
        `response_mode=query`;

      return authUrl;

    } catch (error) {
      console.error('Error generating Microsoft auth URL:', error);
      throw new Error('Failed to generate Microsoft authentication URL');
    }
  }

  async exchangeGoogleCode(code) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      const { tokens } = await oauth2Client.getToken(code);
      return tokens;

    } catch (error) {
      console.error('Error exchanging Google code:', error);
      throw new Error('Failed to exchange Google authorization code');
    }
  }

  async exchangeMicrosoftCode(code) {
    try {
      const axios = require('axios');
      
      const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
      const params = new URLSearchParams();
      params.append('client_id', process.env.MICROSOFT_CLIENT_ID);
      params.append('client_secret', process.env.MICROSOFT_CLIENT_SECRET);
      params.append('code', code);
      params.append('grant_type', 'authorization_code');
      params.append('redirect_uri', process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3000/auth/microsoft/callback');

      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;

    } catch (error) {
      console.error('Error exchanging Microsoft code:', error);
      throw new Error('Failed to exchange Microsoft authorization code');
    }
  }

  async listCloudFiles(service, accessToken, folderId = null) {
    try {
      switch (service.toLowerCase()) {
        case 'google':
        case 'googledrive':
          return await this.listGoogleDriveFiles(accessToken, folderId);
        case 'microsoft':
        case 'onedrive':
          return await this.listOneDriveFiles(accessToken, folderId);
        default:
          throw new Error(`Unsupported cloud service: ${service}`);
      }
    } catch (error) {
      console.error('Error listing cloud files:', error);
      throw new Error(`Failed to list files from ${service}`);
    }
  }

  async listGoogleDriveFiles(accessToken, folderId = null) {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      let query = "mimeType='application/vnd.openxmlformats-officedocument.presentationml.presentation' or mimeType='application/vnd.google-apps.presentation'";
      if (folderId) {
        query += ` and '${folderId}' in parents`;
      }

      const response = await drive.files.list({
        q: query,
        fields: 'files(id,name,mimeType,modifiedTime,webViewLink,size)',
        orderBy: 'modifiedTime desc'
      });

      return response.data.files.map(file => ({
        id: file.id,
        name: file.name,
        type: file.mimeType.includes('google-apps') ? 'Google Slides' : 'PowerPoint',
        modifiedTime: file.modifiedTime,
        url: file.webViewLink,
        size: file.size
      }));

    } catch (error) {
      console.error('Error listing Google Drive files:', error);
      throw new Error('Failed to list Google Drive files');
    }
  }

  async listOneDriveFiles(accessToken, folderId = null) {
    try {
      const axios = require('axios');
      
      let url = 'https://graph.microsoft.com/v1.0/me/drive/root/children';
      if (folderId) {
        url = `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}/children`;
      }

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          '$filter': "endswith(name,'.pptx') or endswith(name,'.ppt')",
          '$orderby': 'lastModifiedDateTime desc'
        }
      });

      return response.data.value.map(file => ({
        id: file.id,
        name: file.name,
        type: 'PowerPoint',
        modifiedTime: file.lastModifiedDateTime,
        url: file.webUrl,
        size: file.size
      }));

    } catch (error) {
      console.error('Error listing OneDrive files:', error);
      throw new Error('Failed to list OneDrive files');
    }
  }

  async createCloudFolder(service, accessToken, folderName, parentId = null) {
    try {
      switch (service.toLowerCase()) {
        case 'google':
        case 'googledrive':
          return await this.createGoogleDriveFolder(accessToken, folderName, parentId);
        case 'microsoft':
        case 'onedrive':
          return await this.createOneDriveFolder(accessToken, folderName, parentId);
        default:
          throw new Error(`Unsupported cloud service: ${service}`);
      }
    } catch (error) {
      console.error('Error creating cloud folder:', error);
      throw new Error(`Failed to create folder in ${service}`);
    }
  }

  async createGoogleDriveFolder(accessToken, folderName, parentId = null) {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder'
      };

      if (parentId) {
        fileMetadata.parents = [parentId];
      }

      const response = await drive.files.create({
        resource: fileMetadata,
        fields: 'id,name,webViewLink'
      });

      return {
        id: response.data.id,
        name: response.data.name,
        url: response.data.webViewLink
      };

    } catch (error) {
      console.error('Error creating Google Drive folder:', error);
      throw new Error('Failed to create Google Drive folder');
    }
  }

  async createOneDriveFolder(accessToken, folderName, parentId = null) {
    try {
      const axios = require('axios');
      
      let url = 'https://graph.microsoft.com/v1.0/me/drive/root/children';
      if (parentId) {
        url = `https://graph.microsoft.com/v1.0/me/drive/items/${parentId}/children`;
      }

      const response = await axios.post(url, {
        name: folderName,
        folder: {},
        '@microsoft.graph.conflictBehavior': 'rename'
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        id: response.data.id,
        name: response.data.name,
        url: response.data.webUrl
      };

    } catch (error) {
      console.error('Error creating OneDrive folder:', error);
      throw new Error('Failed to create OneDrive folder');
    }
  }

  // Utility method to validate access tokens
  async validateAccessToken(service, accessToken) {
    try {
      switch (service.toLowerCase()) {
        case 'google':
        case 'googledrive':
          return await this.validateGoogleToken(accessToken);
        case 'microsoft':
        case 'onedrive':
          return await this.validateMicrosoftToken(accessToken);
        default:
          return false;
      }
    } catch (error) {
      console.error('Error validating access token:', error);
      return false;
    }
  }

  async validateGoogleToken(accessToken) {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      await oauth2.userinfo.get();
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async validateMicrosoftToken(accessToken) {
    try {
      const axios = require('axios');
      
      await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new CloudStorage();