require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Farm = require('./models/Farm');
const EggProductionLog = require('./models/EggProductionLog');
const Listing = require('./models/Listing');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/poultry-farm');

    // Get the first Farmer user
    const farmer = await User.findOne({ role: 'Farmer' });
    if (!farmer) {
      console.log('No farmer user found. Skipping seed.');
      process.exit();
    }

    // 1. Seed Farm and 14 days of logs (to fix the blank Dashboard Overview)
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

    await EggProductionLog.deleteMany({ farm: farm._id });
    const logsToInsert = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const isDip = Math.random() > 0.8; 
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
    console.log('✅ Created 14 days of realistic egg production logs for the Overview chart.');

    // 2. Seed Beautiful Marketplace Listings
    await Listing.deleteMany({ farmer: farmer._id });
    await Listing.create([
      { farmer: farmer._id, productName: 'Farm Fresh Brown Eggs (Premium)', quantity: 250, pricePerUnit: 6, isAvailable: true },
      { farmer: farmer._id, productName: 'Organic Free-Range White Eggs', quantity: 80, pricePerUnit: 8.5, isAvailable: true },
      { farmer: farmer._id, productName: 'Jumbo Golden Yolk Eggs', quantity: 120, pricePerUnit: 7, isAvailable: true },
      { farmer: farmer._id, productName: 'Grade A Mixed Eggs', quantity: 300, pricePerUnit: 5.5, isAvailable: true }
    ]);
    console.log('✅ Crafted 4 Active Marketplace Listings.');
    
    console.log('🎉 Super Seeding complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

seedData();
