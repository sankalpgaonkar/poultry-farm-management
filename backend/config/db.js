const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_MONGODB_URI || process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri && (process.env.NODE_ENV === 'production' || process.env.VERCEL)) {
  console.error('CRITICAL: No MongoDB URI found in environment (tried MONGO_MONGODB_URI, MONGODB_URI, MONGO_URI)');
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const finalUri = mongoUri || 'mongodb://localhost:27017/poultry-farm';
    console.log(`Connecting to MongoDB...`);
    
    const conn = await mongoose.connect(finalUri, {
      connectTimeoutMS: 10000, // Slightly longer for cloud connection
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
