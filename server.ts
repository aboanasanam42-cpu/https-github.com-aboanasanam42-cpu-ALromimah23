import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const port = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // Endpoint: Analyze logo and suggest color schemes, placements, and style tips
  app.post('/api/analyze-logo', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server. Please add it in AI Studio Secrets.' });
      }

      const { logoImageBase64 } = req.body;
      if (!logoImageBase64) {
        return res.status(400).json({ error: 'logoImageBase64 is required' });
      }

      // Remove data url prefix if present
      const base64Data = logoImageBase64.replace(/^data:image\/\w+;base64,/, '');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Analyze this uploaded logo image for a merchandise mockup application. 
                Identify:
                1. The primary, secondary, and accent colors in the logo (provide hex codes).
                2. The logo style (e.g., minimalist, complex, text-only, emblem, organic).
                3. Recommend 3-4 merchandise fabric/base colors (with exact hex codes) that would make this logo stand out (e.g., if the logo is white, recommend dark backgrounds like charcoal or navy; if the logo is colorful, recommend complementary neutral backdrops).
                4. Give 3 professional placement recommendations (e.g., "Left Chest", "Large Center", etc.) with scale suggestions and visual justification.
                5. A short styling tip for how to market this merch.

                Return the response STRICTLY as a JSON object with this exact structure:
                {
                  "logoColors": ["#hex1", "#hex2"],
                  "logoStyle": "Description of logo style",
                  "suggestedBackgrounds": [
                    { "name": "Charcoal Black", "hex": "#1a1a1a", "reason": "Reason why it fits" },
                    { "name": "Off-White", "hex": "#f5f5f0", "reason": "Reason why it fits" }
                  ],
                  "placements": [
                    { "name": "Left Chest", "scale": "25%", "reason": "Reason" },
                    { "name": "Large Center", "scale": "60%", "reason": "Reason" }
                  ],
                  "stylingTip": "A professional merch tip..."
                }
                Do not include markdown blocks like \`\`\`json or any other text before or after the JSON.`
              },
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: base64Data
                }
              }
            ]
          }
        ]
      });

      const responseText = response.text || '{}';
      // Strip out markdown code fences if Gemini returned them
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);
      res.json(parsedData);
    } catch (error: any) {
      console.error('Error analyzing logo:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze logo' });
    }
  });

  // Endpoint: Suggest logo ideas or prompts based on user business type and style preferences
  app.post('/api/generate-logo-ideas', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server. Please add it in AI Studio Secrets.' });
      }

      const { businessName, industry, styleDescription } = req.body;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert branding consultant. Based on the following inputs:
        - Business/Brand Name: ${businessName || 'N/A'}
        - Industry: ${industry || 'N/A'}
        - Desired Style/Vibe: ${styleDescription || 'N/A'}

        Generate 3 distinct creative concepts for a logo design. For each concept, provide:
        1. Concept name
        2. Visual Description (detailed details of shapes, layout, and style)
        3. Suggested Color Palette (with names and hex codes)
        4. Typography suggestion (e.g. bold sans-serif, elegant serif, script)
        5. A specific prompt that could be used in an image generator to create this logo.

        Return the response STRICTLY as a JSON object with this exact structure:
        {
          "concepts": [
            {
              "name": "Concept name",
              "description": "Visual details...",
              "colors": [
                { "name": "Forest Green", "hex": "#1b4d3e" }
              ],
              "typography": "Style...",
              "prompt": "Detailed AI image generation prompt for the logo, isolated on a solid white background, high-resolution vector style, minimalist..."
            }
          ]
        }
        Do not include markdown blocks like \`\`\`json or any other text before or after the JSON.`
      });

      const responseText = response.text || '{}';
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);
      res.json(parsedData);
    } catch (error: any) {
      console.error('Error generating logo ideas:', error);
      res.status(500).json({ error: error.message || 'Failed to generate logo ideas' });
    }
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
