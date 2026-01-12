const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

/* ================= ORDERS ================= */

// Get all orders
router.get('/orders', protect, admin, async (req, res) => {
  const orders = await Order.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
});

// Update order status
router.patch('/orders/:id/status', protect, admin, async (req, res) => {
  const { status } = req.body;

  await Order.findByIdAndUpdate(req.params.id, { status });
  res.json({ success: true, message: 'Status updated' });
});

/* ================= PRODUCTS ================= */

// Add product
router.post('/products', protect, admin, async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// Update product
router.put('/products/:id', protect, admin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
});

// Delete product
router.delete('/products/:id', protect, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

/* ================= USERS ================= */

router.get('/users', protect, admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
