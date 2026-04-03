const express = require('express');
const { 
  getListings, 
  createListing, 
  getFarmerListings, 
  placeOrder, 
  getFarmerOrders, 
  getBuyerOrders, 
  updateOrderStatus, 
  deleteListing,
  getTotalListings
} = require('../controllers/marketplaceController');
const { protect, farmerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Public / Buyer accessible (with protect)
router.get('/', protect, getListings);
router.get('/total-listings', protect, getTotalListings);
router.post('/orders', protect, placeOrder);
router.get('/orders/me', protect, getBuyerOrders);
// Farmer only
router.post('/', protect, farmerOnly, createListing);
router.delete('/:id', protect, farmerOnly, deleteListing);
router.get('/my-listings', protect, farmerOnly, getFarmerListings);
router.get('/orders', protect, farmerOnly, getFarmerOrders);
router.put('/orders/:id/status', protect, farmerOnly, updateOrderStatus);

module.exports = router;
