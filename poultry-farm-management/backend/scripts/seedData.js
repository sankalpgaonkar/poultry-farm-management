const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Farm = require('../models/Farm');
const EggProductionLog = require('../models/EggProductionLog');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/poultry-farm';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // 1. Find or Create User
    let user = await User.findOne({ email: 'test@example.com' });
    if (!user) {
      console.log('Test user not found, creating one...');
      user = await User.create({
        name: 'Test Farmer',
        email: 'test@example.com',
        password: 'password123',
        role: 'Farmer'
      });
    }
    const farmerId = user._id;

    // 2. Clear existing data for this user to avoid duplicates if re-running
    await Farm.deleteMany({ farmer: farmerId });
    await EggProductionLog.deleteMany({ farmer: farmerId });
    console.log('Cleared existing farms and logs for test user.');

    // 3. Create Farms
    const farmA = await Farm.create({
      farmer: farmerId,
      name: 'North Ridge Farm',
      location: 'Sector 7, Green Valley',
      totalChickens: 500
    });

    const farmB = await Farm.create({
      farmer: farmerId,
      name: 'Sunny Side Poultry',
      location: 'East Coast Highway',
      totalChickens: 800
    });

    console.log('Created 2 farms.');

    // 4. Create 14 days of logs
    const logs = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Farm A logs
      logs.push({
        farm: farmA._id,
        farmer: farmerId,
        date: date,
        totalEggs: Math.floor(farmA.totalChickens * (0.85 + Math.random() * 0.1)), // 85-95% productivity
        temperature: 24 + Math.floor(Math.random() * 8), // 24-32 degrees
        humidity: 60 + Math.floor(Math.random() * 20),
        feedConsumed: Math.floor(farmA.totalChickens * 0.11), // ~110g per bird
        mortalityCount: Math.random() > 0.8 ? 1 : 0
      });

      // Farm B logs
      logs.push({
        farm: farmB._id,
        farmer: farmerId,
        date: date,
        totalEggs: Math.floor(farmB.totalChickens * (0.80 + Math.random() * 0.15)), // 80-95% productivity
        temperature: 25 + Math.floor(Math.random() * 7),
        humidity: 55 + Math.floor(Math.random() * 25),
        feedConsumed: Math.floor(farmB.totalChickens * 0.115),
        mortalityCount: Math.random() > 0.9 ? 2 : 0
      });
    }

    await EggProductionLog.insertMany(logs);
    console.log(`Inserted ${logs.length} production logs.`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
