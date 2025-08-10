const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// cloudinary already configured in server.js
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'car_dealer_images',
    allowed_formats: ['jpg','jpeg','png','webp']
  }
});
const parser = multer({ storage });

// Create / upload a new car (admin)
router.post('/add', parser.array('images', 6), async (req, res) => {
  try {
    const { make, model, year, price, description, adminPassword } = req.body;

    // Simple admin check (replace w/real auth in production)
    if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }

    const images = (req.files || []).map(f => f.path); // cloudinary url in path
    const car = new Car({ make, model, year, price, description, images });
    await car.save();
    res.json({ success: true, car });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// List all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get one car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete car (optional)
router.delete('/:id', async (req, res) => {
  try {
    // Simple admin check via query param (not secure—replace for real app)
    const { adminPassword } = req.query;
    if (process.env.ADMIN_PASSWORD && adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }
    await Car.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
