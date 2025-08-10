const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: Number,
  price: Number,
  description: String,
  images: [String], // cloudinary URLs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', CarSchema);
