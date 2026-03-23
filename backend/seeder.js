const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Farm = require('./models/Farm');
const Listing = require('./models/Listing');
const EggProductionLog = require('./models/EggProductionLog');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Farm.deleteMany();
    await Listing.deleteMany();
    await EggProductionLog.deleteMany();

    // 1. Create Users
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash('password123', salt);
    
    const createdUsers = await User.insertMany([
      { name: 'John Doe (Farmer)', email: 'farmer1@test.com', password: hash1, role: 'Farmer' },
      { name: 'Alice Smith (Buyer)', email: 'buyer1@test.com', password: hash1, role: 'Buyer' }
    ]);
    const farmerId = createdUsers[0]._id;

    // 2. Create Farm
    const createdFarms = await Farm.insertMany([
      { farmer: farmerId, name: 'Sunny Brooke Poultry', location: 'Texas, USA', totalChickens: 500 }
    ]);
    const farmId = createdFarms[0]._id;

    // 3. Create historical logs (last 14 days)
    const logs = [];
    const today = new Date();
    for(let i=14; i>=0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      const temp = 25 + Math.random() * 8; // 25-33 C
      const eggs = Math.floor(500 * 0.8 * (temp > 30 ? 0.9 : 1.0)); // random realistic drop based on temp
      
      logs.push({
        farm: farmId,
        farmer: farmerId,
        date: d,
        totalEggs: eggs,
        temperature: temp,
        humidity: 60 + Math.random()*20,
        feedConsumed: 120 + Math.random()*10,
        mortalityCount: Math.random() > 0.8 ? 1 : 0
      });
    }
    await EggProductionLog.insertMany(logs);

    // 4. Create active listings
    await Listing.insertMany([
      { farmer: farmerId, productName: 'Organic Brown Eggs (Tray of 30)', quantity: 50, pricePerUnit: 12.50 },
      { farmer: farmerId, productName: 'Large White Eggs (Tray of 30)', quantity: 100, pricePerUnit: 9.00 }
    ]);

    console.log('Dummy Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
