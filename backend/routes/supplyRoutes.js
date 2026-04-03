const express = require('express');
const { placeSupplyOrder, getMySupplyOrders, receiveSupplyOrder } = require('../controllers/supplyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/order', protect, placeSupplyOrder);
router.get('/my-orders', protect, getMySupplyOrders);
router.put('/:id/receive', protect, receiveSupplyOrder);

module.exports = router;
