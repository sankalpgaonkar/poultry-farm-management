const express = require('express');
const { predictProduction, chatWithAssistant, getSmartAlerts } = require('../controllers/aiController');
const { protect, farmerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/predict', protect, farmerOnly, predictProduction);
router.post('/chat', protect, farmerOnly, chatWithAssistant);
router.get('/alerts', protect, farmerOnly, getSmartAlerts);

module.exports = router;
