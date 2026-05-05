const proxyquire = require('proxyquire');

class MockGoogleGenAI {
  constructor() {
    this.models = {
      generateContent: async (params) => {
        console.log("PAYLOAD RECEIVED:\n", JSON.stringify(params, null, 2));
        return { text: "Mock response text" };
      }
    };
  }
}

const aiController = proxyquire('./backend/controllers/aiController.js', {
  '@google/genai': {
    GoogleGenAI: MockGoogleGenAI
  }
});

const req = {
  body: {
    message: "What should I feed my chickens?",
    history: [
      { role: "model", content: "I am ready." },
      { role: "user", content: "Hi" },
      { role: "user", content: "How are you?" },
      { role: "model", content: "I am fine." },
      { role: "model", content: "How can I help?" }
    ]
  }
};

const res = {
  json: (data) => console.log("SUCCESS:", JSON.stringify(data)),
  status: (code) => {
    console.log("STATUS:", code);
    return {
      json: (data) => console.log("ERROR:", JSON.stringify(data))
    };
  }
};

(async () => {
    // We need proxyquire since the import is dynamic: await import("@google/genai")
    // Let's actually use proxyquire or jest
})();
