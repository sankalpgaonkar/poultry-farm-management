const express = require('express');
const router = express.Router();
const { protect, farmerOnly } = require('../middleware/authMiddleware');
const { analyzeHealth } = require('../controllers/healthController');

router.post('/analyze', protect, farmerOnly, analyzeHealth);

module.exports = router;
