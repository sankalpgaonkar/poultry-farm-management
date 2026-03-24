export default function handler(req, res) {
  res.status(200).json({ 
    message: "ESM Test Successful",
    env: process.env.NODE_ENV
  });
}
