const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./backend/models/User');
const Notification = require('./backend/models/Notification');

async function fixUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_MONGODB_URI);
    
    console.log('Finding user: test@example.com');
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('❌ User test@example.com NOT found.');
      return;
    }
    
    console.log(`✅ User found: ${user._id} (${user.name})`);
    
    console.log('Removing pending alerts for this user...');
    const result = await Notification.deleteMany({ user: user._id, type: 'Alert' });
    console.log(`✅ Removed ${result.deletedCount} pending alerts.`);
    
    // Optionally remove all notifications if that's what's needed
    const resultAll = await Notification.deleteMany({ user: user._id });
    console.log(`✅ Total notifications removed: ${resultAll.deletedCount}`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
  }
}

fixUser();
