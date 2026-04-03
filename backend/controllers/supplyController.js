const SupplyOrder = require('../models/SupplyOrder');
const Inventory = require('../models/Inventory');

// POST Place a supply order
const placeSupplyOrder = async (req, res) => {
  try {
    const { storeName, items, totalAmount } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const order = new SupplyOrder({
      user: req.user._id,
      storeName,
      items,
      totalAmount,
      status: 'Ordered'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET My supply orders
const getMySupplyOrders = async (req, res) => {
  try {
    const orders = await SupplyOrder.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT Mark order as received and sync inventory
const receiveSupplyOrder = async (req, res) => {
  try {
    const order = await SupplyOrder.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Order already marked as delivered' });
    }

    // Update stock levels in Inventory
    const inventoryUpdates = order.items.map(async (item) => {
      // Map store categories to inventory categories
      let invCategory = 'Other';
      if (['Feed', 'Medicine', 'Equipment'].includes(item.category)) {
        invCategory = item.category;
      }

      // Try to find existing inventory item
      let inventoryItem = await Inventory.findOne({ 
        farmer: req.user._id, 
        itemName: item.name 
      });

      if (inventoryItem) {
        inventoryItem.quantity += item.quantity;
        return await inventoryItem.save();
      } else {
        // Create new inventory item
        const newInventoryItem = new Inventory({
          farmer: req.user._id,
          itemName: item.name,
          category: invCategory,
          quantity: item.quantity,
          unit: item.name.toLowerCase().includes('kg') ? 'kg' : (item.name.toLowerCase().includes('liter') ? 'liters' : 'units'),
          lowStockThreshold: 10
        });
        return await newInventoryItem.save();
      }
    });

    await Promise.all(inventoryUpdates);

    order.status = 'Delivered';
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeSupplyOrder, getMySupplyOrders, receiveSupplyOrder };
