import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

import fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
}
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Route for Gemini
app.post('/api/insights', async (req, res) => {
  try {
    const { history, currentScore } = req.body;
    
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      return res.status(400).json({ 
        id: 'error', 
        text: 'Gemini API key is not configured on the server.', 
        type: 'neutral' 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    if (!history || history.length === 0) {
        return res.json({
            id: 'init-1',
            text: "Welcome to EcoSphere! Start logging your daily actions in the Swipe Tracker to shrink your footprint. I'll monitor your progress and give you tailored advice here.",
            type: 'neutral'
        });
    }

    const prompt = `
      You are the "AI Oracle" for an eco-tracking app called EcoSphere.
      The user's current carbon footprint score is ${currentScore} (0 is best, 100 is worst).
      Here is the user's recent logged action history (a=action, i=impact):
      ${JSON.stringify(history)}
      
      Generate exactly 1 personalized, encouraging insight for the user based strictly on their recent actions.
      Limit the insight to 2 concise sentences. Be punchy and modern.
      
      Return ONLY a valid JSON object in the following format (no markdown, no backticks):
      {
        "id": "unique-string",
        "text": "Your insight text here",
        "type": "praise"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON safely
    const cleanText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedInsight = JSON.parse(cleanText);
    
    res.json(parsedInsight);
  } catch (error) {
    console.error("Gemini API Server Error:", error);
    res.status(500).json({ 
      id: 'error-fallback', 
      text: `AI Oracle Server Error: ${error.message || 'Unknown error'}`, 
      type: 'neutral' 
    });
  }
});

// Serve React App in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
