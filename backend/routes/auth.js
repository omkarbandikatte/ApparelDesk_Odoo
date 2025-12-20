const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

// Public routes
router.post('/login', authController.login);
router.post('/signup', authController.signup);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;

