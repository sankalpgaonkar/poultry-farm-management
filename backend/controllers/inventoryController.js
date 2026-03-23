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

module.exports = { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem };
