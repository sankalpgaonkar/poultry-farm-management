const express = require('express');
const multer = require('multer');
const { predictProduction, chatWithAssistant, getSmartAlerts, processPhoto } = require('../controllers/aiController');
const { protect, farmerOnly } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/predict', protect, farmerOnly, predictProduction);
router.post('/chat', chatWithAssistant);
router.get('/alerts', protect, farmerOnly, getSmartAlerts);
router.post('/process-photo', protect, farmerOnly, upload.single('photo'), processPhoto);

module.exports = router;
