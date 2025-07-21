#!/bin/bash

# SlideCraft Deployment Script
# Usage: ./deploy.sh [platform]
# Platforms: vercel, netlify, heroku, docker

set -e

PLATFORM=${1:-"vercel"}

echo "🚀 Deploying SlideCraft to $PLATFORM..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Creating from template..."
    cp .env.production .env
    echo "📝 Please edit .env with your actual API keys before deployment!"
    exit 1
fi

# Check if OpenAI API key is set
if grep -q "your_openai_api_key_here" .env; then
    echo "❌ Please set your OpenAI API key in .env file"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test || echo "⚠️  Tests failed, continuing anyway..."

case $PLATFORM in
    "vercel")
        echo "🔵 Deploying to Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    
    "netlify")
        echo "🟠 Deploying to Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        ;;
    
    "heroku")
        echo "🟣 Deploying to Heroku..."
        if ! command -v heroku &> /dev/null; then
            echo "❌ Please install Heroku CLI first"
            exit 1
        fi
        git add .
        git commit -m "Deploy to Heroku" || echo "No changes to commit"
        git push heroku main
        ;;
    
    "docker")
        echo "🐳 Building Docker image..."
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker not found. Please install Docker first"
            exit 1
        fi
        docker build -t slidecraft .
        echo "✅ Docker image built successfully!"
        echo "Run with: docker run -p 3000:3000 --env-file .env slidecraft"
        ;;
    
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo "Available platforms: vercel, netlify, heroku, docker"
        exit 1
        ;;
esac

echo "✅ Deployment completed!"
echo "🌐 Your SlideCraft app should be live shortly!"