const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

console.log('Backend starting...');
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL: process.env.VERCEL,
  hasMongoUri: !!(process.env.MONGO_URI || process.env.MONGO_MONGODB_URI),
  hasJwtSecret: !!process.env.JWT_SECRET
});

// Global Error Handlers for better Vercel logs
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥', err);
});

// REMOVED connectDB() here to avoid blocking cold starts
// connectDB();

const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected. Attempting to connect...');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    next(error);
  }
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use('/api', limiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const logRoutes = require('./routes/logRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const aiRoutes = require('./routes/aiRoutes');
const healthRoutes = require('./routes/healthRoutes');
const financeRoutes = require('./routes/financeRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const communityRoutes = require('./routes/communityRoutes');
const smartRoutes = require('./routes/smartRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/smart', smartRoutes);

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is reachable', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    env: {
      hasMongoUri: !!(process.env.MONGO_URI || process.env.MONGO_MONGODB_URI),
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasOpenAiKey: !!process.env.OPENAI_API_KEY,
      usingFallbackUri: !process.env.MONGO_URI && !!process.env.MONGO_MONGODB_URI
    }
  });
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
