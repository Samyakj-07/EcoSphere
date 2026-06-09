import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const envStr = fs.readFileSync(".env.local", "utf8");
const match = envStr.match(/VITE_GEMINI_API_KEY="([^"]+)"/);
const apiKey = match ? match[1] : null;

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function run() {
  try {
    const prompt = `return {"hello": "world"} in json`;
    const result = await model.generateContent(prompt);
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
