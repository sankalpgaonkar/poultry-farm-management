const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey123', {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  console.log(`Registration attempt for: ${req.body.email || 'unknown'}`);
  try {
    const { name, email, phone, password, role } = req.body;
    
    if (!email || !password || !name || !role) {
       return res.status(400).json({ message: 'Missing required fields' });
    }

    // Clean phone number: if empty string, set to undefined so sparse index works
    const cleanedPhone = phone === '' ? undefined : phone;

    const queryOptions = [{ email }];
    if (cleanedPhone) queryOptions.push({ phone: cleanedPhone });
    
    console.log(`Checking if user exists: email=${email}, phone=${cleanedPhone}`);
    const userExists = await User.findOne({ $or: queryOptions });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    console.log(`Creating user: ${name} (${email})`);
    const user = await User.create({
      name,
      email,
      phone: cleanedPhone,
      password,
      role,
    });

    if (user) {
      console.log(`User created successfully: ${user._id}`);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
};

const authUser = async (req, res) => {
  const { email, identifier, password } = req.body;
  const loginId = identifier || email;
  console.log(`Login attempt for: ${loginId || 'unknown'}`);
  
  try {
    if (!loginId) {
       return res.status(400).json({ message: 'Please provide email or phone' });
    }

    const isEmail = loginId.includes('@');
    console.log(`Searching for user with ${isEmail ? 'email' : 'phone'}: ${loginId}`);
    const user = await User.findOne(isEmail ? { email: loginId } : { phone: loginId });

    if (user && (await user.matchPassword(password))) {
      console.log(`Login successful for user: ${user._id}`);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { registerUser, authUser, getUserProfile };
