const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const token = jwt.sign({ _id: '64f8e9a2b5e3a7c1d4e5f6g7' }, process.env.JWT_SECRET || 'supersecretjwtkey123', { expiresIn: '1h' });
console.log(token);
