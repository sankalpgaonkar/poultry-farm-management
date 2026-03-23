require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Farm = require('./models/Farm');
const EggProductionLog = require('./models/EggProductionLog');

async function seedUserData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/poultry-farm');

    // Get the first Farmer user
    const farmer = await User.findOne({ role: 'Farmer' });
    if (!farmer) {
      console.log('No farmer user found. Please sign up first.');
      process.exit();
    }

    // Check if farm already exists
    let farm = await Farm.findOne({ farmer: farmer._id });
    if (!farm) {
      farm = await Farm.create({
        farmer: farmer._id,
        name: 'Valley View Poultry',
        location: 'California, Region 5',
        totalChickens: 1200,
        vaccinationSchedule: 'Next NDV: Dec 15'
      });
      console.log('✅ Created dummy farm:', farm.name);
    }

    // Clear old logs to prevent doubling up
    await EggProductionLog.deleteMany({ farm: farm._id });

    // Seed 14 days of logs
    const logsToInsert = [];
    const today = new Date();
    
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      const isDip = Math.random() > 0.8; // Random production dip
      const eggs = isDip ? 940 : 1080 + Math.floor(Math.random() * 40);
      const temp = 22 + Math.random() * 4;

      logsToInsert.push({
        farm: farm._id,
        farmer: farmer._id,
        date: d,
        totalEggs: eggs,
        temperature: temp.toFixed(1),
        humidity: 60,
        feedConsumed: 125,
        mortalityCount: 0
      });
    }

    await EggProductionLog.insertMany(logsToInsert);
    console.log('✅ Created 14 days of valid egg logs.');
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

seedUserData();
