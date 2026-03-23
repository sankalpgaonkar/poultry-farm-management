const express = require('express');
const { getLogs, createLog } = require('../controllers/logController');
const { protect, farmerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, farmerOnly, getLogs)
  .post(protect, farmerOnly, createLog);

module.exports = router;
