module.exports = (req, res) => {
  res.json({
    message: 'Minimal Vercel function test',
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL
    }
  });
};
