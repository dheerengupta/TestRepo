# AI-Powered PowerPoint Generator (First Slide Only)

This minimal Python utility generates the **first (title) slide** of a PowerPoint presentation automatically using OpenAI to craft a compelling title and subtitle.

## Features

* Input a topic and instantly receive a professionally phrased title & subtitle.
* Saves a `.pptx` file you can continue editing in Microsoft PowerPoint or Google Slides.

## Quick Start

1. **Clone this repo / download the script.**
2. **Install dependencies** (ideally in a virtual environment):
   ```bash
   pip install -r requirements.txt
   ```
3. **Set your OpenAI key**:
   ```bash
   export OPENAI_API_KEY="sk-your-key"
   ```
4. **Run**:
   ```bash
   python generate_pptx.py "Quantum Computing for Beginners" -o quantum.pptx
   ```
5. Open `quantum.pptx` in PowerPoint. Your title slide is ready!

> **Next steps:** This is just the foundation. You can extend the script to generate full decks from documents, notes, or web links by extracting key points with the OpenAI API and adding slides iteratively.