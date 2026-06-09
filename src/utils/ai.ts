import type { LoggedAction } from '../context/EcoContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface InsightMessage {
  id: string;
  text: string;
  type: 'praise' | 'suggestion' | 'neutral';
}

export async function generateInsights(history: LoggedAction[], currentScore: number): Promise<InsightMessage[]> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      return [{ id: 'error', text: 'Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in .env.local.', type: 'neutral' }];
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    // Handle initial state without making API call
    if (history.length === 0) {
        return [{
            id: 'init-1',
            text: "Welcome to EcoSphere! Start logging your daily actions in the Swipe Tracker to shrink your footprint. I'll monitor your progress and give you tailored advice here.",
            type: 'neutral'
        }];
    }

    const prompt = `
      You are the "AI Oracle" for an eco-tracking app called EcoSphere.
      The user's current carbon footprint score is ${currentScore} (0 is best, 100 is worst).
      Here is the user's recent logged action history:
      ${JSON.stringify(history.slice(0, 5))}
      
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
    
    return [parsedInsight];
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return [{ id: 'error-fallback', text: `AI Oracle Error: ${error.message || 'Unknown error'}`, type: 'neutral' }];
  }
}
