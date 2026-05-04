require('dotenv').config({ path: 'poultry-farm-management/.env' });
const { GoogleGenAI } = require("@google/genai");

async function test() {
  const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "YOUR_TEST_KEY" }); // We might not have a key here, so we will just see if we can instantiate and see the expected payload format
}
test();
