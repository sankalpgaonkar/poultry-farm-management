const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Farm = require('../models/Farm');
const EggProductionLog = require('../models/EggProductionLog');
const Listing = require('../models/Listing');
const Order = require('../models/Order');

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/poultry-farm';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // 1. Create or Update Test Farmer
    let farmer = await User.findOne({ email: 'test@example.com' });
    if (!farmer) {
      console.log('Test farmer not found, creating one...');
      farmer = await User.create({
        name: 'Sankalp (Test Farmer)',
        email: 'test@example.com',
        password: 'password123',
        role: 'Farmer'
      });
    } else {
      farmer.name = 'Sankalp (Test Farmer)';
      await farmer.save();
    }

    // 2. Clear existing related data
    await Farm.deleteMany({ farmer: farmer._id });
    await EggProductionLog.deleteMany({ farmer: farmer._id });
    await Listing.deleteMany({ farmer: farmer._id });
    await Order.deleteMany({ farmer: farmer._id }); // Orders as a seller
    await Order.deleteMany({ buyer: farmer._id });  // Orders as a buyer
    console.log('Cleared existing data for test farmer.');

    // 3. Create Farms
    const farmA = await Farm.create({
      farmer: farmer._id,
      name: 'Kisan Mitra Main Coop',
      location: 'Green Valley, Plot 42',
      totalChickens: 1200
    });

    const farmB = await Farm.create({
      farmer: farmer._id,
      name: 'Kisan Mitra Breeding Center',
      location: 'South Hills, Block B',
      totalChickens: 800
    });
    console.log('Created 2 farms under Kisan Mitra branding.');

    // 4. Create Marketplace Listings for the Farmer
    const listings = await Listing.insertMany([
      {
        farmer: farmer._id,
        productName: 'Fresh Organic Brown Eggs',
        description: 'Large, organic, pasture-raised brown eggs. Delivered fresh within 24 hours.',
        quantity: 500,
        pricePerUnit: 12, // per dozen
        isAvailable: true
      },
      {
        farmer: farmer._id,
        productName: 'Premium Poultry Feed (Bulk)',
        description: 'High-protein starter feed suitable for chicks up to 8 weeks.',
        quantity: 50,
        pricePerUnit: 45, // per bag
        isAvailable: true
      }
    ]);
    console.log('Created 2 marketplace listings.');

    // 5. Create 30 days of production logs
    const logs = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Farm A
      logs.push({
        farm: farmA._id,
        farmer: farmer._id,
        date: date,
        totalEggs: Math.floor(farmA.totalChickens * (0.85 + Math.random() * 0.1)),
        temperature: 24 + Math.floor(Math.random() * 8),
        humidity: 60 + Math.floor(Math.random() * 20),
        currentChickenCount: farmA.totalChickens - (Math.random() > 0.95 ? 1 : 0),
        feedConsumed: Math.floor(farmA.totalChickens * 0.11),
        mortalityCount: Math.random() > 0.95 ? 1 : 0
      });

      // Farm B
      logs.push({
        farm: farmB._id,
        farmer: farmer._id,
        date: date,
        totalEggs: Math.floor(farmB.totalChickens * (0.80 + Math.random() * 0.12)),
        temperature: 25 + Math.floor(Math.random() * 7),
        humidity: 55 + Math.floor(Math.random() * 25),
        currentChickenCount: farmB.totalChickens - (Math.random() > 0.9 ? 1 : 0),
        feedConsumed: Math.floor(farmB.totalChickens * 0.115),
        mortalityCount: Math.random() > 0.9 ? 1 : 0
      });
    }
    await EggProductionLog.insertMany(logs);
    console.log(`Inserted ${logs.length} production logs.`);

    // 6. Create a dummy test buyer and some orders
    let buyer = await User.findOne({ email: 'buyer@example.com' });
    if (!buyer) {
      buyer = await User.create({
        name: 'Local Store Manager',
        email: 'buyer@example.com',
        password: 'password123',
        role: 'Buyer'
      });
    }

    // Orders placed BY the farmer (Purchase History) - From a supplier
    let supplier = await User.findOne({ email: 'supplier@agrisupply.com' });
    if (!supplier) {
      supplier = await User.create({
        name: 'AgriSupply Co.',
        email: 'supplier@agrisupply.com',
        password: 'password123',
        role: 'Buyer' // Using a generic user for dummy supplier
      });
    }

    const supplierListing = await Listing.create({
      farmer: supplier._id,
      productName: 'Automatic Egg Incubator Pro',
      quantity: 10,
      pricePerUnit: 8500,
      isAvailable: true
    });

    await Order.create({
      buyer: farmer._id,
      listing: supplierListing._id,
      farmer: supplier._id,
      quantityOrdered: 1,
      totalPrice: 8500,
      status: 'Completed'
    });

    // Orders received BY the farmer (Sales History)
    await Order.create({
      buyer: buyer._id,
      listing: listings[0]._id,
      farmer: farmer._id,
      quantityOrdered: 100,
      totalPrice: 1200,
      status: 'Pending'
    });

    await Order.create({
      buyer: buyer._id,
      listing: listings[0]._id,
      farmer: farmer._id,
      quantityOrdered: 50,
      totalPrice: 600,
      status: 'Accepted'
    });

    console.log('Seeded marketplace orders (Sales and Purchases).');
    console.log('Kisan Mitra AI environment is fully restored and populated!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
