const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('../config/database');
// Import models to ensure relationships are loaded
require('../models');

// Serve uploaded images



// Import routes
const authRoutes = require('../routes/auth');
const productRoutes = require('../routes/products');
const contactRoutes = require('../routes/contacts');
const userRoutes = require('../routes/user')
const saleOrderRoutes = require('../routes/saleOrders');
const couponRoutes = require('../routes/coupons');
const invoiceRoutes = require('../routes/invoices');
const adminRoutes = require('../routes/admin');
const discountRoutes = require('../routes/discountOffers')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sale-orders', saleOrderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/discount-offers', discountRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync database (use { alter: true } for development, remove for production)
    // await db.sync({ alter: true });
    // console.log('✅ Database synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

