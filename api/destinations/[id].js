import connectDB from '../lib/mongodb.js';
import Destination from '../lib/Destination.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
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

  const { id } = req.query;

  // GET single destination
  if (req.method === 'GET') {
    try {
      const destination = await Destination.findById(id);
      if (!destination) {
        return res.status(404).json({ success: false, error: 'Destination not found' });
      }
      return res.status(200).json({ success: true, data: destination });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // PUT — update destination
  if (req.method === 'PUT') {
    try {
      const destination = await Destination.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!destination) {
        return res.status(404).json({ success: false, error: 'Destination not found' });
      }
      return res.status(200).json({ success: true, data: destination });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  // DELETE — remove destination
  if (req.method === 'DELETE') {
    try {
      const destination = await Destination.findByIdAndDelete(id);
      if (!destination) {
        return res.status(404).json({ success: false, error: 'Destination not found' });
      }
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
