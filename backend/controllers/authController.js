const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Contact } = require('../models');
const { JWT_SECRET } = require('../middlewares/auth');

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, error: 'Invalid email or password' });
    }

    // Generate token (UUID id)
    const token = generateToken(user.id);

    // Get user contact via user_id (Option A you chose)
    const contact = await Contact.findOne({
      where: { user_id: user.id },
    });

    // Build response (no password)
    const userData = {
      id: user.id,
      name: user.name,
      role: user.role, // 'internal' | 'portal'
      email: user.email,
      mobile: user.mobile,
      address_city: user.address_city,
      address_state: user.address_state,
      address_pincode: user.address_pincode,
      contact: contact
        ? {
            id: contact.id,
            name: contact.name,
            type: contact.type,
            email: contact.email,
            mobile: contact.mobile,
            address_city: contact.address_city,
            address_state: contact.address_state,
            address_pincode: contact.address_pincode,
          }
        : null,
    };

    return res.json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Login failed' });
  }
};


// assuming your User model is updated to have:
// id (UUID), name, role (ENUM: 'internal' | 'portal'),
// email, password, mobile, address_city, address_state, address_pincode
const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      mobile,
      address_city,
      address_state,
      address_pincode,
      role, // 'portal' or 'internal'
    } = req.body;

    // 1. Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, password and role are required',
      });
    }

    if (!['internal', 'portal'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Role must be either internal or portal',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // 2. Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 4. Create user (portal or internal)
    const user = await User.create({
      name,
      role, // ENUM: 'internal' | 'portal'
      email,
      password: hashedPassword,
      mobile: mobile || null,
      address_city: address_city || null,
      address_state: address_state || null,
      address_pincode: address_pincode || null,
    });

    // 5. Create linked Contact (always)
    // For portal signup, type must be 'customer'
    const contactType = 'customer';

    const contact = await Contact.create({
      user_id: user.id,            // FK to users.id
      name,
      type: contactType,           // 'customer' | 'vendor' | 'both'
      email,
      mobile: mobile || null,
      address_city: address_city || null,
      address_state: address_state || null,
      address_pincode: address_pincode || null,
    });

    // 6. Generate token (using UUID user.id)
    const token = generateToken(user.id);

    // 7. Response (without password)
    const userData = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
      address_city: user.address_city,
      address_state: user.address_state,
      address_pincode: user.address_pincode,
      contact: {
        id: contact.id,
        name: contact.name,
        type: contact.type,
        email: contact.email,
        mobile: contact.mobile,
        address_city: contact.address_city,
        address_state: contact.address_state,
        address_pincode: contact.address_pincode,
      },
    };

    return res.status(201).json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Signup failed',
    });
  }
};



// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [Contact], // no alias since association has none [web:103][web:118]
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get current user error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to get user' });
  }
};


module.exports = {
  login,
  signup,
  getCurrentUser,
};

