import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tripg';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Import routes
import destinationsRouter from './api/destinations/index.js';
import destinationByIdRouter from './api/destinations/[id].js';
import seedRouter from './api/seed.js';

// Simple Express adapter for Vercel-style handlers
function adaptHandler(handler) {
  return async (req, res) => {
    req.query = { ...req.query, ...req.params };
    await handler(req, res);
  };
}

app.use('/api/destinations', (req, res, next) => {
  if (req.params.id || req.path.match(/^\/[a-f0-9]{24}/i)) {
    return next();
  }
  adaptHandler(destinationsRouter)(req, res);
});

app.use('/api/destinations/:id', adaptHandler(destinationByIdRouter));
app.post('/api/seed', adaptHandler(seedRouter));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 TripG API running on http://localhost:${PORT}`);
});
