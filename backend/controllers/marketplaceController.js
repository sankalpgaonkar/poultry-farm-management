const Listing = require('../models/Listing');
const Order = require('../models/Order');

// GET all active listings (for buyers)
const getListings = async (req, res) => {
  try {
    const listings = await Listing.find({ isAvailable: true }).populate('farmer', 'name');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST calculate new listing (Farmer only)
const createListing = async (req, res) => {
  try {
    const { productName, description, quantity, pricePerUnit, image } = req.body;
    const listing = new Listing({
      farmer: req.user._id,
      productName,
      description,
      quantity,
      pricePerUnit,
      image
    });

    const createdListing = await listing.save();
    res.status(201).json(createdListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET farmer's listings 
const getFarmerListings = async (req, res) => {
  try {
    const listings = await Listing.find({ farmer: req.user._id });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST Place an order (Buyer only)
const placeOrder = async (req, res) => {
  try {
    const { listingId, quantityOrdered } = req.body;
    
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.quantity < quantityOrdered) return res.status(400).json({ message: 'Not enough quantity available' });

    const totalPrice = listing.pricePerUnit * quantityOrdered;

    const order = new Order({
      buyer: req.user._id,
      listing: listingId,
      farmer: listing.farmer,
      quantityOrdered,
      totalPrice,
      status: 'Pending'
    });

    // Reduce listing quantity
    listing.quantity -= quantityOrdered;
    if (listing.quantity <= 0) listing.isAvailable = false;
    await listing.save();

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Farmer's orders received
const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id }).populate('listing').populate('buyer', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE order status (Farmer only)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.farmer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE farmer's listing
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.farmer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

    await listing.deleteOne();
    res.json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getListings, createListing, getFarmerListings, placeOrder, getFarmerOrders, updateOrderStatus, deleteListing };
