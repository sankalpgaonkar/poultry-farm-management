const express = require('express');
const router = express.Router();
const { protect, farmerOnly } = require('../middleware/authMiddleware');
const { calculateProfit } = require('../controllers/financeController');

router.post('/calculate', protect, farmerOnly, calculateProfit);

module.exports = router;
