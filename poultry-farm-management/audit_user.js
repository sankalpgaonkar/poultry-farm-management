use('poultry-farm');

const user = db.users.findOne({ email: 'test@example.com' });

if (!user) {
    console.log('❌ User not found.');
} else {
    console.log('\n--- User Audit ---');
    console.log(`ID: ${user._id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Role: ${user.role}`);
    console.log(`Is Verified: ${user.isVerified}`);
    
    // Check farm
    const farm = db.farms.findOne({ farmer: user._id });
    console.log('\n--- Farm Data ---');
    if (farm) {
        console.log(`Farm Name: ${farm.farmName}`);
        console.log(`Location: ${farm.location}`);
        console.log(`Chicken Count: ${farm.currentChickenCount}`);
    } else {
        console.log('❌ No farm profile found for this user.');
    }
    
    // Check Inventory
    const inventoryCount = db.inventories.countDocuments({ farmer: user._id });
    console.log(`\n--- Inventory ---`);
    console.log(`Items found: ${inventoryCount}`);
    
    // Check Egg Logs
    const logCount = db.eggproductionlogs.countDocuments({ farmer: user._id });
    console.log(`\n--- Egg Logs ---`);
    console.log(`Logs found: ${logCount}`);

    // Check Alerts specifically
    const alertCount = db.notifications.countDocuments({ user: user._id, type: 'Alert' });
    console.log(`\n--- Alerts ---`);
    console.log(`Pending alerts found: ${alertCount}`);
}
