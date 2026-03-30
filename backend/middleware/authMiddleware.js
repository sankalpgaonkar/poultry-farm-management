const jwt = require('jsonwebtoken');
const User = require('../models/User');
const supabase = require('../utils/supabase');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 1. Try Supabase verification first
      const { data: { user: supabaseUser }, error: supabaseError } = await supabase.auth.getUser(token);

      if (!supabaseError && supabaseUser) {
        req.user = await User.findOne({ supabaseId: supabaseUser.id }).select('-password');
        if (req.user) return next();
      }

      // 2. Fallback to legacy JWT verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey123');
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const farmerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Farmer') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, Farmer only' });
  }
};

module.exports = { protect, farmerOnly };
