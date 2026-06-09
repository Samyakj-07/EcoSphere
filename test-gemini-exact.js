import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const envStr = fs.readFileSync(".env.local", "utf8");
const match = envStr.match(/VITE_GEMINI_API_KEY="([^"]+)"/);
const apiKey = match ? match[1] : null;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function run() {
  try {
    const history = [{"id":"plant_based","text":"Ate a plant-based meal?","impact":-15,"date":"2026-06-09T16:58:00.000Z"}];
    const currentScore = 60;
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
    console.log("Raw response:", responseText);
    
    // Parse JSON safely
    const cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    console.log("Cleaned text:", cleanText);
    const parsedInsight = JSON.parse(cleanText);
    console.log("Parsed JSON:", parsedInsight);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
