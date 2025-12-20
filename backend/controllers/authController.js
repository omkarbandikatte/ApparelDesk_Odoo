const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Contact } = require('../models');
const { JWT_SECRET } = require('../middlewares/auth');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Get user contact if exists
    const contact = await Contact.findOne({ where: { userId: user.id } });

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      contact: contact ? {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        mobile: contact.mobile,
        address: contact.address,
      } : null,
    };

    res.json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, password, mobile, address, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine if admin based on role
    const isAdmin = role === 'seller';

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      isAdmin,
    });

    // Create contact
    const contactType = isAdmin ? 'vendor' : 'customer';
    const contact = await Contact.create({
      userId: user.id,
      name,
      email,
      mobile: mobile || null,
      address: address || null,
      contactType,
    });

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        mobile: contact.mobile,
        address: contact.address,
      },
    };

    res.status(201).json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Contact,
        as: 'contact',
      }],
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
};

module.exports = {
  login,
  signup,
  getCurrentUser,
};

