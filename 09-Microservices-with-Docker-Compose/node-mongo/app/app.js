const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// ── MongoDB Connection ────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/devopsdb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ── Simple Schema ─────────────────────────────────────────
const ItemSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
});
const Item = mongoose.model('Item', ItemSchema);

// ── Routes ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Node.js + MongoDB Microservice is running!' });
});

app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const item = new Item({ name: req.body.name });
  await item.save();
  res.status(201).json(item);
});

// ── Start Server ──────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
