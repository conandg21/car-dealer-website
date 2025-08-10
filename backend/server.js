require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const carsRoute = require('./routes/cars');
const messagesRoute = require('./routes/messages');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connect error', err));

// Routes
app.use('/api/cars', carsRoute);
app.use('/api/messages', messagesRoute);

// Simple root
app.get('/', (req, res) => res.json({ msg: 'Car Dealer API' }));

// Use port assigned by host (Render/Heroku) or 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
