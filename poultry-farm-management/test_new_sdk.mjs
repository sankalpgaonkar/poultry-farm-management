import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const ai = new GoogleGenAI({ apiKey: process.env.AIzaSyCfJa0JPJnVzG_-KygFfqEuM0ZeqUG7h_k });

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: "Explain how AI works in a few words" }] }],
    });
    console.log("Success:", response.text);
  } catch (err) {
    console.log("Error:", err.message);
    if (err.message.includes('not found')) {
      console.log("Trying gemini-3-flash-preview...");
      try {
        const res3 = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: "Hello! Is Gemini 3 live?" }] }],
        });
        console.log("Gemini 3 Response:", res3.text);
      } catch (err3) {
        console.log("Gemini 3 Error:", err3.message);
      }
    }
  }
}

main();
