import connectDB from '../lib/mongodb.js';
import Destination from '../lib/Destination.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    return res.status(500).json({
      success: false,
      error: 'ডেটাবেজ কানেক্ট করা যায়নি: ' + err.message,
    });
  }

  // GET all destinations
  if (req.method === 'GET') {
    try {
      const destinations = await Destination.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: destinations });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // POST — create new destination
  if (req.method === 'POST') {
    try {
      const destination = await Destination.create(req.body);
      return res.status(201).json({ success: true, data: destination });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
