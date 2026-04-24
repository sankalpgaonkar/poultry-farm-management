const { GoogleGenAI } = require("@google/genai");

async function run() {
  const aiClient = new GoogleGenAI({ apiKey: "DUMMY" });

  const systemInstruction = "Hello";
  const message = "hi";
  const history = [];

  const contents = [
    { role: 'user', parts: [{ text: systemInstruction }] },
    { role: 'model', parts: [{ text: "Understood. I am Kisan Mitra, your advisor. I will provide expert farming advice with smart suggestions at the end of every response." }] },
    ...history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  console.log(JSON.stringify(contents, null, 2));
}
run();
