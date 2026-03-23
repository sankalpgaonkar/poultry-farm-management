const Farm = require('../models/Farm');

const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ farmer: req.user._id });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFarm = async (req, res) => {
  try {
    const { name, location, totalChickens, vaccinationSchedule } = req.body;
    const farm = new Farm({
      farmer: req.user._id,
      name,
      location,
      totalChickens,
      vaccinationSchedule
    });
    const createdFarm = await farm.save();
    res.status(201).json(createdFarm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFarm = async (req, res) => {
  try {
    const { name, location, totalChickens, vaccinationSchedule } = req.body;
    const farm = await Farm.findById(req.params.id);

    if (farm && farm.farmer.toString() === req.user._id.toString()) {
      farm.name = name || farm.name;
      farm.location = location || farm.location;
      farm.totalChickens = totalChickens !== undefined ? totalChickens : farm.totalChickens;
      farm.vaccinationSchedule = vaccinationSchedule || farm.vaccinationSchedule;

      const updatedFarm = await farm.save();
      res.json(updatedFarm);
    } else {
      res.status(404).json({ message: 'Farm not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (farm && farm.farmer.toString() === req.user._id.toString()) {
      await farm.deleteOne();
      res.json({ message: 'Farm removed' });
    } else {
      res.status(404).json({ message: 'Farm not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getFarms, createFarm, updateFarm, deleteFarm };
