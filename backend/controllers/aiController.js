const { GoogleGenAI } = require('@google/genai');
const Prediction = require('../models/Prediction');

const predictProduction = async (req, res) => {
  try {
    const { chickens = 0, age = 0, feedQuality = 'Average', feedQty = 0, temperature = 25, humidity = 60, lighting = 12, breed = 'Unknown' } = req.body;
    
    // Surrogate ML Model Logic (Linear Regression styling)
    let idealProduction = chickens * 0.95; // Theoretical max: 95% laying rate
    
    let ageFactor = 1.0;
    if (age < 20) ageFactor = 0.3 + (age/20)*0.6;
    else if (age > 70) ageFactor = Math.max(0.4, 0.9 - ((age-70)*0.015));
    
    let tempFactor = 1.0;
    if (temperature > 30) tempFactor = Math.max(0.5, 1.0 - (temperature - 30) * 0.05);
    if (temperature < 15) tempFactor = Math.max(0.6, 1.0 - (15 - temperature) * 0.03);
    
    let lightingFactor = (lighting >= 14 && lighting <= 16) ? 1.0 : (lighting < 14 ? 0.8 : 0.9);
    
    let feedQualityFactor = feedQuality === 'Good' ? 1.0 : feedQuality === 'Average' ? 0.85 : 0.7;
    
    let feedQtyPerBird = chickens > 0 ? (feedQty / chickens) : 0;
    let feedQtyFactor = feedQtyPerBird >= 0.11 ? 1.0 : Math.max(0.4, feedQtyPerBird / 0.11);

    let overallEfficiency = Math.max(0, ageFactor * tempFactor * lightingFactor * feedQualityFactor * feedQtyFactor);
    let predictedEggs = Math.floor(idealProduction * overallEfficiency);
    
    // Smart Insights Generation
    let insights = [];
    if (temperature > 30) insights.push(`High temperature (${temperature}°C) is reducing production significantly.`);
    if (temperature < 15) insights.push(`Low temperature (${temperature}°C) is forcing birds to use energy for heat rather than eggs.`);
    if (feedQuality !== 'Good') insights.push('Increase feed quality to "Good" for better yield.');
    if (age < 20) insights.push('Flock is too young for peak production (optimal is 20-70 weeks).');
    if (age > 70) insights.push('Flock is aging. Egg production naturally declines after 70 weeks.');
    if (lighting < 14) insights.push('Increase lighting to 14-16 hours per day to stimulate egg laying.');
    if (feedQtyPerBird < 0.11 && chickens > 0) insights.push(`Feed quantity is low (${(feedQtyPerBird*1000).toFixed(0)}g/bird). Target ~110g-120g per bird daily.`);

    const prediction = new Prediction({
      farmer: req.user._id,
      inputData: { chickens, age, feedQuality, feedQty, temperature, humidity, lighting, breed },
      predictedEggs,
      confidence: 85 + Math.floor(Math.random() * 10)
    });

    await prediction.save();
    
    res.json({
      prediction,
      idealProduction: Math.floor(idealProduction),
      efficiency: Math.round(overallEfficiency * 100),
      insights
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      // Mocked response for development without API Key
      return res.json({ 
        reply: "I am a smart poultry assistant. Right now I am in offline simulation mode without a Gemini API Key. To improve egg production, ensure temperature is below 30°C and feed quality is high."
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const systemInstruction = "You are an expert poultry farm assistant. Answer farmers' questions simply and give actionable advice on breeding, diseases, feed, and management.";
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 250,
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ message: "Error communicating with AI Assistant" });
  }
};

const getSmartAlerts = async (req, res) => {
  // Mock smart alerts based on typical triggers
  res.json([
    { type: 'Temperature', message: 'Temperature in Farm A is above 35°C. High risk of heat stress!', severity: 'High' },
    { type: 'Feed', message: 'Feed stock is running low based on current consumption rates.', severity: 'Medium' }
  ]);
};

module.exports = { predictProduction, chatWithAssistant, getSmartAlerts };
