const Inventory = require('../models/Inventory');

const getInventory = async (req, res) => {
  try {
    const items = await Inventory.find({ farmer: req.user._id });
    
    // Check for low stock alerts
    const alerts = items
      .filter(item => item.quantity <= item.lowStockThreshold)
      .map(item => `Low stock alert: ${item.itemName} (${item.quantity} ${item.unit} remaining).`);
      
    res.json({ items, alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addInventoryItem = async (req, res) => {
  try {
    const { itemName, category, quantity, unit, lowStockThreshold, dailyConsumptionRate } = req.body;
    const item = new Inventory({
      farmer: req.user._id,
      itemName, category, quantity, unit, lowStockThreshold, dailyConsumptionRate
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.farmer.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.farmer.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bulkAddInventoryItems = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid items data' });
    }

    const createdItems = [];
    for (const itemData of items) {
      // Try to find existing item to update quantity, or create new
      let item = await Inventory.findOne({ 
        farmer: req.user._id, 
        itemName: new RegExp(`^${itemData.itemName}$`, 'i') 
      });

      if (item) {
        item.quantity += Number(itemData.quantity);
        if (itemData.category) item.category = itemData.category;
        if (itemData.unit) item.unit = itemData.unit;
        await item.save();
        createdItems.push(item);
      } else {
        const newItem = new Inventory({
          farmer: req.user._id,
          itemName: itemData.itemName,
          category: itemData.category || 'Other',
          quantity: Number(itemData.quantity),
          unit: itemData.unit || 'kg',
          lowStockThreshold: itemData.lowStockThreshold || 10,
          dailyConsumptionRate: itemData.dailyConsumptionRate || 0
        });
        await newItem.save();
        createdItems.push(newItem);
      }
    }

    res.status(201).json(createdItems);
  } catch (error) {
    console.error('Bulk inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getInventory, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  bulkAddInventoryItems
};
