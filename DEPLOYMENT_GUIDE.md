# 🚀 SlideCraft Deployment Guide

Deploy your AI-powered presentation generator to the cloud with these step-by-step instructions.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] OpenAI API key
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)
- [ ] Application tested locally
- [ ] Git repository initialized

## 🌐 Deployment Options

### 1. 🔵 **Vercel (Recommended - Easiest)**

**Best for:** Quick deployment, serverless, automatic scaling

#### Steps:
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Set environment variables in Vercel dashboard
# Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables
# Add: OPENAI_API_KEY, SESSION_SECRET, etc.

# 5. Deploy to production
vercel --prod
```

#### Environment Variables to Set:
```
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
NODE_ENV=production
```

**Live in ~2 minutes!** ⚡

---

### 2. 🟠 **Netlify**

**Best for:** Static sites with serverless functions

#### Steps:
```bash
# 1. Install dependencies
npm install serverless-http

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Login to Netlify
netlify login

# 4. Deploy
netlify deploy

# 5. Deploy to production
netlify deploy --prod
```

#### Environment Variables:
Set in Netlify dashboard: Site Settings → Environment Variables

---

### 3. 🟣 **Heroku**

**Best for:** Traditional hosting, easy scaling

#### Steps:
```bash
# 1. Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Create app
heroku create your-slidecraft-app

# 4. Set environment variables
heroku config:set OPENAI_API_KEY=your_key
heroku config:set SESSION_SECRET=your_secret
heroku config:set NODE_ENV=production

# 5. Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### Heroku Procfile:
```
web: node server.js
```

---

### 4. 🔵 **Google Cloud Platform**

**Best for:** Enterprise deployment, full control

#### Steps:
```bash
# 1. Install Google Cloud SDK
# Download from: https://cloud.google.com/sdk/docs/install

# 2. Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 3. Deploy to App Engine
gcloud app deploy

# 4. Set environment variables
gcloud app deploy --env-vars-file=env.yaml
```

#### Create env.yaml:
```yaml
env_variables:
  OPENAI_API_KEY: "your_key"
  SESSION_SECRET: "your_secret"
  NODE_ENV: "production"
```

---

### 5. 🟦 **DigitalOcean App Platform**

**Best for:** Affordable, managed hosting

#### Steps:
1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Configure:
   - **Source**: Your GitHub repo
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
5. Set environment variables in the dashboard
6. Deploy!

---

### 6. 🐳 **Docker Deployment**

**Best for:** Any cloud provider, maximum portability

#### Local Docker:
```bash
# Build image
docker build -t slidecraft .

# Run container
docker run -p 3000:3000 --env-file .env slidecraft
```

#### Docker Compose:
```bash
# Start with compose
docker-compose up -d

# Stop
docker-compose down
```

#### Deploy to any cloud:
- **AWS ECS**
- **Google Cloud Run**
- **Azure Container Instances**
- **DigitalOcean Container Registry**

---

### 7. ☁️ **AWS Deployment**

#### Option A: AWS Lambda (Serverless)
```bash
# 1. Install Serverless Framework
npm install -g serverless

# 2. Configure AWS credentials
aws configure

# 3. Deploy
serverless deploy
```

#### Option B: AWS EC2
```bash
# 1. Launch EC2 instance
# 2. SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# 3. Install Node.js and clone repo
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
git clone your-repo-url
cd slidecraft

# 4. Install dependencies and start
npm install
pm2 start server.js --name slidecraft
```

---

## 🔐 Environment Variables

### Required:
```env
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_secure_session_secret
NODE_ENV=production
```

### Optional:
```env
# Google Cloud (for Drive/Slides integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Microsoft (for OneDrive integration)
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret

# External APIs
UNSPLASH_ACCESS_KEY=your_unsplash_key
PEXELS_API_KEY=your_pexels_key
```

## 🛡️ Security Checklist

Before going live:

- [ ] Update all API keys
- [ ] Set strong session secret
- [ ] Configure CORS properly
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure rate limiting
- [ ] Review security headers

## 📊 Monitoring & Maintenance

### Health Checks:
```bash
# Test your deployed app
curl https://your-app-url.com/api/templates
```

### Logs:
- **Vercel**: View in dashboard
- **Heroku**: `heroku logs --tail`
- **Google Cloud**: `gcloud app logs tail -s default`

### Updates:
```bash
# Deploy updates
git add .
git commit -m "Update features"
git push origin main  # Auto-deploys on most platforms
```

## 🚀 Quick Start Commands

### Fastest Deployment (Vercel):
```bash
npx vercel
```

### Docker Deployment:
```bash
npm run docker:build
npm run docker:run
```

### All Platforms:
```bash
# Choose your platform
npm run deploy:vercel
npm run deploy:netlify
npm run deploy:heroku
```

## 🎯 Platform Comparison

| Platform | Setup Time | Cost | Scaling | Best For |
|----------|------------|------|---------|----------|
| **Vercel** | 2 min | Free tier | Auto | Quick demos |
| **Netlify** | 5 min | Free tier | Auto | Static + API |
| **Heroku** | 10 min | $7/month | Manual | Traditional apps |
| **Google Cloud** | 15 min | Pay-as-use | Auto | Enterprise |
| **DigitalOcean** | 10 min | $5/month | Manual | Cost-effective |
| **Docker** | 20 min | Varies | Manual | Any provider |

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails**:
   ```bash
   npm install
   npm run build
   ```

2. **Environment Variables Missing**:
   - Check platform-specific env var settings
   - Verify OpenAI API key is valid

3. **File Upload Issues**:
   - Ensure uploads directory exists
   - Check file size limits on platform

4. **CORS Errors**:
   - Update CORS settings in server.js
   - Add your domain to allowed origins

### Platform-Specific:

**Vercel**: 
- Functions timeout after 10s (hobby) / 60s (pro)
- File uploads limited to 4.5MB

**Netlify**:
- Functions timeout after 10s
- File size limit: 6MB

**Heroku**:
- Free tier sleeps after 30min inactivity
- File uploads to /tmp (temporary)

## 🎉 You're Live!

Once deployed, your SlideCraft app will be accessible at your platform's URL. Share it with the world! 🌍

**Example URLs:**
- Vercel: `https://slidecraft-username.vercel.app`
- Netlify: `https://slidecraft-username.netlify.app`
- Heroku: `https://your-app-name.herokuapp.com`

**Test your deployment** with a simple topic like "AI in Healthcare" to ensure everything works! 🎯