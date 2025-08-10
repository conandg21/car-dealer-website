const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// store a message (customer -> dealer)
router.post('/send', async (req, res) => {
  try {
    const { name, email, phone, message, carId } = req.body;
    const msg = new Message({ name, email, phone, message, carId });
    await msg.save();
    // You can add email sending here (e.g., nodemailer) if you want notifications
    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// get messages (admin)
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
