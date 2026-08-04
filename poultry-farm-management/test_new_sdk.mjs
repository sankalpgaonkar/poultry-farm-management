import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'fake_key' });

async function main() {
  try {
    const config = {
      systemInstruction: "You are a test bot",
    };

    const contents = [
      { role: 'model', parts: [{ text: "Hello from model" }] },
      { role: 'user', parts: [{ text: "Explain how AI works in a few words" }] }
    ];

    // We will just print what we generate
    console.log(JSON.stringify(contents, null, 2));
  } catch (err) {
    console.log("Error:", err.message);
  }
}

main();
