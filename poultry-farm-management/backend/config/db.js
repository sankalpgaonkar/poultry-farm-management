const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_MONGODB_URI || process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri && (process.env.NODE_ENV === 'production' || process.env.VERCEL)) {
  console.error('CRITICAL: No MongoDB URI found in environment (tried MONGO_MONGODB_URI, MONGODB_URI, MONGO_URI)');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const finalUri = mongoUri || 'mongodb://localhost:27017/poultry-farm';
    console.log(`[DB] Init MongoDB connection to: ${finalUri.split('@').pop()}`);
    
    cached.promise = mongoose.connect(finalUri, {
      connectTimeoutMS: 5000, 
      serverSelectionTimeoutMS: 5000
    }).then((mongooseInstance) => {
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    // DO NOT process.exit(1) here; let the request handler return a 503 status.
    throw error;
  }
};

module.exports = connectDB;
