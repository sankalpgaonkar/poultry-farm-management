require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Farm = require('./models/Farm');
const EggProductionLog = require('./models/EggProductionLog');
const Listing = require('./models/Listing');
const Order = require('./models/Order');
const Inventory = require('./models/Inventory');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/poultry-farm');
    console.log('🔗 Connected to MongoDB...');

    // 1. Ensure a Farmer and a Buyer exist
    let farmer = await User.findOne({ role: 'Farmer' });
    if (!farmer) {
      farmer = await User.create({
        name: 'John Farmer',
        email: 'farmer@test.com',
        password: 'password123',
        role: 'Farmer'
      });
      console.log('👤 Created default Farmer account (farmer@test.com)');
    }

    let buyer = await User.findOne({ role: 'Buyer' });
    if (!buyer) {
      buyer = await User.create({
        name: 'Gourmet Kitchens',
        email: 'buyer@test.com',
        password: 'password123',
        role: 'Buyer'
      });
      console.log('👤 Created default Buyer account (buyer@test.com)');
    }

    // 2. Seed Farm and 14 days of Vibrant Logs
    let farm = await Farm.findOne({ farmer: farmer._id });
    if (!farm) {
      farm = await Farm.create({
        name: 'Majestic Valley Poultry',
        farmer: farmer._id,
        location: 'California, North Region',
        totalChickens: 1500,
        vaccinationSchedule: 'Next NDV: Dec 15'
      });
      console.log('✅ Created farm:', farm.name);
    }

    await EggProductionLog.deleteMany({ farm: farm._id });
    const logsToInsert = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      
      // Simulate realistic daily variation
      const baseProduction = 1100;
      const variation = Math.floor(Math.random() * 100);
      const isDipDay = Math.random() > 0.85; // Occasional production dip
      const eggs = isDipDay ? 950 : baseProduction + variation;
      
      logsToInsert.push({
        farm: farm._id,
        farmer: farmer._id,
        date: d,
        totalEggs: eggs,
        temperature: (24 + (Math.random() * 5 - 2.5)).toFixed(1),
        currentChickenCount: 1500,
        humidity: 65,
        feedConsumed: 140,
        mortalityCount: i === 7 ? 2 : 0 // Add a minor mortality event for realism
      });
    }
    await EggProductionLog.insertMany(logsToInsert);
    console.log('📈 Generated 14 days of high-fidelity production history.');

    // 3. Seed Premium Marketplace Listings
    await Listing.deleteMany({ farmer: farmer._id });
    const listings = await Listing.create([
      { 
        farmer: farmer._id, 
        productName: 'Silver Laced Wyandotte Day Old Chicks', 
        category: 'BIRD',
        description: 'Vaccinated for Newcastle and Marek’s. High-yield lineage with beautiful show-quality feathers. Perfect for dual-purpose farms.',
        quantity: 150, 
        pricePerUnit: 12, 
        isAvailable: true 
      },
      { 
        farmer: farmer._id, 
        productName: 'Organic Omega-3 Enriched Brown Eggs (24-Tray)', 
        category: 'EGG',
        description: 'Certified organic feed, free-range chickens. Rich golden yolks with high Omega-3 content. Freshly harvested daily.',
        quantity: 45, 
        pricePerUnit: 180, 
        isAvailable: true 
      },
      { 
        farmer: farmer._id, 
        productName: 'High-Protein Chick Starter Mash (50kg)', 
        category: 'FEED',
        description: 'Accelerated growth formula with prebiotics. Essential for the first 8 weeks of life to ensure strong skeletal development.',
        quantity: 20, 
        pricePerUnit: 450, 
        isAvailable: true 
      },
      { 
        farmer: farmer._id, 
        productName: 'Cornish Cross Broilers (Ready for Harvest)', 
        category: 'BIRD',
        description: 'Average weight 3.2kg. Meat-type birds raised on non-GMO feed. Healthy, active, and tender meat quality.',
        quantity: 85, 
        pricePerUnit: 15, 
        isAvailable: true 
      },
      { 
        farmer: farmer._id, 
        productName: 'Automatic Digital Pro Incubator (48 Eggs)', 
        category: 'EQUIPMENT',
        description: 'Fully automatic egg turning with integrated humidity and temperature control. High hatch rate guaranteed (95%+).',
        quantity: 5, 
        pricePerUnit: 2500, 
        isAvailable: true 
      },
      { 
        farmer: farmer._id, 
        productName: 'Gourmet Quail Eggs (30-Pack Box)', 
        category: 'EGG',
        description: 'Miniature superfood. Beautifully speckled shells, rich flavor profile. Popular for high-end culinary presentations.',
        quantity: 200, 
        pricePerUnit: 60, 
        isAvailable: true 
      },
    ]);
    console.log('🏘️ Marketed 6 diverse, premium listings across all categories.');

    // 4. Seed Transaction History (Orders)
    await Order.deleteMany({}); // Start fresh
    await Order.create([
      {
        buyer: buyer._id,
        listing: listings[1]._id, // Enriched Eggs
        farmer: farmer._id,
        quantityOrdered: 5,
        totalPrice: 900,
        status: 'Completed'
      },
      {
        buyer: buyer._id,
        listing: listings[0]._id, // Chicks
        farmer: farmer._id,
        quantityOrdered: 20,
        totalPrice: 240,
        status: 'Pending'
      },
      {
        buyer: buyer._id,
        listing: listings[2]._id, // Starter Mash
        farmer: farmer._id,
        quantityOrdered: 2,
        totalPrice: 900,
        status: 'Accepted'
      },
      {
        buyer: buyer._id,
        listing: listings[3]._id, // Broilers
        farmer: farmer._id,
        quantityOrdered: 10,
        totalPrice: 150,
        status: 'Rejected'
      }
    ]);
    console.log('🧾 Processed 4 sample orders in various lifecycle stages.');

    // 5. Seed Professional Inventory
    await Inventory.deleteMany({ farmer: farmer._id });
    await Inventory.create([
      { farmer: farmer._id, itemName: 'High-Protein Starter Mash', category: 'Feed', quantity: 120, unit: 'kg', lowStockThreshold: 100, dailyConsumptionRate: 15 },
      { farmer: farmer._id, itemName: 'Omega-3 Layer Pellet', category: 'Feed', quantity: 500, unit: 'kg', lowStockThreshold: 50, dailyConsumptionRate: 25 },
      { farmer: farmer._id, itemName: 'Newcastle Vaccine (Vial)', category: 'Medicine', quantity: 15, unit: 'vials', lowStockThreshold: 20, dailyConsumptionRate: 0 },
      { farmer: farmer._id, itemName: 'Digital Feeding Tray', category: 'Equipment', quantity: 24, unit: 'units', lowStockThreshold: 5, dailyConsumptionRate: 0 },
    ]);
    console.log('📦 Stocked 4 essential inventory categories.');

    console.log('\n🌟 PRE-PRESENTATION SEEDING COMPLETE! 🌟');
    console.log('The platform is now ready for a flawless demo.');
    process.exit();
  } catch (error) {
    console.error(`❌ Error during seeding: ${error.message}`);
    process.exit(1);
  }
}

seedData();
