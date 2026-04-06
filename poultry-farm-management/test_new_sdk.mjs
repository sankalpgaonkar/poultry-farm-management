import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: "Explain how AI works in a few words" }] }],
    });
    console.log("Success:", response.text);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

main();
