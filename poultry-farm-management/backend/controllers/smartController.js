const getSchemes = async (req, res) => {
  try {
    const mockSchemes = [
      { id: 1, title: 'National Livestock Mission (NLM)', description: 'Subsidies up to 50% for rural poultry entrepreneurship.', region: 'India', benefits: ['Capital Subsidy', 'Training'] },
      { id: 2, title: 'Poultry Venture Capital Fund', description: 'Financial assistance to self-employed individuals to establish poultry units.', region: 'Global', benefits: ['Low Interest Loan', 'Operational Support'] },
      { id: 3, title: 'Rural Backyard Poultry Development', description: 'Free distribution of 4-week-old chicks to farmers living below the poverty line.', region: 'Global', benefits: ['Free Livestock', 'Starter Feed'] }
    ];
    // Return static mock for now
    res.json(mockSchemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBuyerMatches = async (req, res) => {
  try {
    // Simulated Matching Algorithm
    const buyers = [
      { id: 101, name: 'Local Grocers Inc.', distanceMiles: 4.2, neededQuantity: 500, offeredPrice: 10.50, matchScore: 98 },
      { id: 102, name: 'Sunrise Organic Markets', distanceMiles: 12.0, neededQuantity: 200, offeredPrice: 12.00, matchScore: 85 },
      { id: 103, name: 'City Bakeries', distanceMiles: 8.5, neededQuantity: 1000, offeredPrice: 9.75, matchScore: 72 }
    ];
    res.json(buyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDailyReport = async (req, res) => {
  try {
    // Simulated AI Synthesis
    const report = {
      date: new Date().toLocaleDateString(),
      efficiencyScore: Math.floor(Math.random() * (95 - 75 + 1) + 75), // Random between 75 and 95
      summary: "Your farm is operating slightly above the regional average. Egg production is stable, but feed efficiency has dropped by 2%.",
      actionItems: [
        "Check water lines in Barn B for possible leaks.",
        "Your Layer feed inventory will expire in 4 days. Consider re-ordering soon.",
        "Weather forecast predicts a heatwave next week; optimize barn ventilation."
      ]
    };
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSchemes, getBuyerMatches, getDailyReport };
