const express = require('express');
const { getFarms, createFarm, updateFarm, deleteFarm } = require('../controllers/farmController');
const { protect, farmerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, farmerOnly, getFarms)
  .post(protect, farmerOnly, createFarm);

router.route('/:id')
  .put(protect, farmerOnly, updateFarm)
  .delete(protect, farmerOnly, deleteFarm);

module.exports = router;
