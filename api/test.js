module.exports = function handler(req, res) {
  res.status(200).json({
    message: 'API Test Successful',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
};
