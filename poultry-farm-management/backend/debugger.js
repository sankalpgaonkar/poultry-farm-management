require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

async function debug() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/poultry-farm');
    let user = await User.findOne({ role: 'Farmer' });
    if (!user) {
      user = new User({ name: 'Test', email: `test${Date.now()}@test.com`, password: 'asd', role: 'Farmer' });
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    console.log('✅ Testing Finance API...');
    const res = await fetch('http://localhost:5000/api/finance/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        birdsCount: 1000, dailyFeedKg: 120, feedCostPerKg: 0.40, dailyEggProduction: 850, eggSalePrice: 0.15, laborCostDaily: 30, utilitiesCostDaily: 10
      })
    });
    console.log('Finance Status:', res.status);
    console.log('Finance Data:', await res.text());

    console.log('✅ Testing Prediction API...');
    const aiRes = await fetch('http://localhost:5000/api/ai/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        chickens: 1000, age: 25, feedQuality: 'Good', feedQty: 120, temperature: 24, humidity: 60, lighting: 15, breed: 'Leghorn'
      })
    });
    console.log('AI Status:', aiRes.status);
    console.log('AI Data:', await aiRes.text());

  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
}
debug();
