const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Farm = require('./models/Farm');
const Listing = require('./models/Listing');
const EggProductionLog = require('./models/EggProductionLog');
const CommunityPost = require('./models/CommunityPost');
const SupplyOrder = require('./models/SupplyOrder');
const Order = require('./models/Order');
const Inventory = require('./models/Inventory');
const connectDB = require('./config/db');

dotenv.config();

const megaSeed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Farm.deleteMany(),
      Listing.deleteMany(),
      EggProductionLog.deleteMany(),
      CommunityPost.deleteMany(),
      SupplyOrder.deleteMany(),
      Order.deleteMany(),
      Inventory.deleteMany()
    ]);

    console.log('Cleanup complete. Seeding new data...');

    // 1. Create Users
    const users = await User.create([
      { name: 'Sankalp (Farmer)', email: 'test@example.com', password: 'password123', role: 'Farmer' },
      { name: 'John (Buyer)', email: 'buyer@example.com', password: 'password123', role: 'Buyer' },
      { name: 'Sarah (Farmer)', email: 'sarah@example.com', password: 'password123', role: 'Farmer' }
    ]);

    const farmer = users[0];
    const buyer = users[1];
    const otherFarmer = users[2];

    // 2. Create Farms
    const farms = await Farm.create([
      { farmer: farmer._id, name: 'Eco-Friendly Poultry Farm', location: 'Green Valley, CA', totalChickens: 1200 },
      { farmer: otherFarmer._id, name: 'Heritage Heights Farm', location: 'Blue Ridge, NC', totalChickens: 800 }
    ]);

    const mainFarm = farms[0];

    // 3. Create active listings (Matching imageConstants.js terms)
    const listings = await Listing.create([
      // Eggs
      { farmer: farmer._id, productName: 'Premium Brown Eggs (30 Tray)', category: 'EGG', quantity: 150, pricePerUnit: 14.99, description: 'Freshly laid brown eggs from pasture-raised hens.' },
      { farmer: farmer._id, productName: 'Clean White Eggs (Single Dozen)', category: 'EGG', quantity: 200, pricePerUnit: 5.50, description: 'Grade A large white eggs.' },
      { farmer: otherFarmer._id, productName: 'Bulk Organic Eggs (100+)', category: 'EGG', quantity: 50, pricePerUnit: 45.00, description: 'Bulk supply for bakeries.' },

      // Birds
      { farmer: farmer._id, productName: 'Healthy Day Old Chicks', category: 'BIRD', quantity: 500, pricePerUnit: 2.50, description: 'Strong, vaccinated chicks ready for brooding.' },
      { farmer: otherFarmer._id, productName: 'Premium Layer Hens (1yr)', category: 'BIRD', quantity: 100, pricePerUnit: 18.00, description: 'Productive layers started on organic feed.' },
      { farmer: otherFarmer._id, productName: 'Standard Broilers (6 Weeks)', category: 'BIRD', quantity: 300, pricePerUnit: 12.00, description: 'Meat birds ready for processing.' },

      // Feeds
      { farmer: farmer._id, productName: 'High Protein Feed Mash', category: 'FEED', quantity: 80, pricePerUnit: 22.00, description: 'Custom blend for maximum egg production.' },
      { farmer: otherFarmer._id, productName: 'Organic Grain Feed (25kg)', category: 'FEED', quantity: 40, pricePerUnit: 35.00, description: 'Non-GMO certified grain mix.' },

      // Equipment
      { farmer: farmer._id, productName: 'Smart Digital Incubator', category: 'EQUIPMENT', quantity: 10, pricePerUnit: 180.00, description: 'Advanced humidity and temp control with LED display.' },
      { farmer: otherFarmer._id, productName: 'Automatic Bell Waterer', category: 'EQUIPMENT', quantity: 25, pricePerUnit: 15.50, description: 'Durable red waterer for floor brooding.' }
    ]);

    // 4. Create historical logs (30 days)
    const productionLogs = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const logDate = new Date(now);
      logDate.setDate(logDate.getDate() - i);
      
      const tempBase = 24 + Math.sin(i / 5) * 5; // Fluctuating temp
      const mortalChance = Math.random() > 0.95 ? Math.floor(Math.random() * 3) : 0;
      
      productionLogs.push({
        farm: mainFarm._id,
        farmer: farmer._id,
        date: logDate,
        totalEggs: 800 + Math.floor(Math.random() * 100) - (tempBase > 28 ? 50 : 0),
        temperature: tempBase + Math.random() * 2,
        humidity: 65 + Math.random() * 10,
        currentChickenCount: 1200 - (i < 15 ? 100 : 0), // Simulating bird sale transition
        feedConsumed: 280 + Math.random() * 20,
        mortalityCount: mortalChance
      });
    }
    await EggProductionLog.insertMany(productionLogs);

    // 5. Create Community Posts
    await CommunityPost.create([
      { author: farmer._id, title: 'Tips for Heat Management', content: 'In the summer months, it is crucial to keep the ventilation running at 100% capacity and add electrolytes to the water.', category: 'Guide', likes: [buyer._id], comments: [] },
      { author: otherFarmer._id, title: 'Seeking Organic Grain Suppliers', content: 'Anyone know a reliable source for non-GMO corn in the Southeast?', category: 'Question', likes: [], comments: [] }
    ]);

    // 6. Create some orders
    await Order.create([
      { buyer: buyer._id, farmer: farmer._id, listing: listings[0]._id, quantity: 2, totalPrice: 29.98, status: 'Completed' },
      { buyer: buyer._id, farmer: farmer._id, listing: listings[3]._id, quantity: 50, totalPrice: 125.0, status: 'Pending' }
    ]);

    // 7. Inventory for the farmer
    await Inventory.create([
      { farmer: farmer._id, itemName: 'Layer Feed Mash', category: 'FEED', quantity: 45, unit: 'Bags', minThreshold: 10 },
      { farmer: farmer._id, itemName: 'New Castle Vaccine', category: 'MED', quantity: 15, unit: 'Vials', minThreshold: 5 },
      { farmer: farmer._id, itemName: 'Vitamin Boosters', category: 'MED', quantity: 20, unit: 'Bottles', minThreshold: 5 }
    ]);

    console.log('Seeding complete! Log in as test@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

megaSeed();
