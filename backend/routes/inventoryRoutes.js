const express = require('express');
const router = express.Router();
const { protect, farmerOnly } = require('../middleware/authMiddleware');
const { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = require('../controllers/inventoryController');

router.route('/')
  .get(protect, farmerOnly, getInventory)
  .post(protect, farmerOnly, addInventoryItem);

router.route('/:id')
  .put(protect, farmerOnly, updateInventoryItem)
  .delete(protect, farmerOnly, deleteInventoryItem);

module.exports = router;
