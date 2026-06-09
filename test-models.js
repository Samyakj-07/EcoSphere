import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const envStr = fs.readFileSync(".env.local", "utf8");
const match = envStr.match(/VITE_GEMINI_API_KEY="([^"]+)"/);
const apiKey = match ? match[1] : null;

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("hello");
    console.log(`Success with ${modelName}`);
  } catch (err) {
    console.log(`Failed with ${modelName}:`, err.message.substring(0, 150));
  }
}

async function run() {
  await testModel("gemini-flash-lite-latest");
  await testModel("gemini-2.5-flash-lite");
  await testModel("gemini-2.0-flash-lite");
  await testModel("gemini-pro-latest");
  await testModel("gemini-3.5-flash");
}
run();
