const EggProductionLog = require('../models/EggProductionLog');
const Farm = require('../models/Farm');

const getLogs = async (req, res) => {
  try {
    // Only get logs for farms belonging to the user
    // First, find user's farms
    const farms = await Farm.find({ farmer: req.user._id });
    const farmIds = farms.map(f => f._id);
    
    // Find logs for those farms
    const logs = await EggProductionLog.find({ farm: { $in: farmIds } }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLog = async (req, res) => {
  try {
    const { farmId, date, totalEggs, temperature, humidity, feedConsumed, mortalityCount } = req.body;
    
    // Check if farm belongs to farmer
    const farm = await Farm.findById(farmId);
    if (!farm || farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Farm not found or unauthorized' });
    }

    const log = new EggProductionLog({
      farm: farmId,
      farmer: req.user._id,
      date: date || Date.now(),
      totalEggs,
      temperature,
      humidity,
      feedConsumed,
      mortalityCount
    });

    // Update farm chicken count based on mortality
    if (mortalityCount && mortalityCount > 0) {
      farm.totalChickens = Math.max(0, farm.totalChickens - mortalityCount);
      await farm.save();
    }

    const createdLog = await log.save();
    res.status(201).json(createdLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLogs, createLog };
