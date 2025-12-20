const { User, Contact } = require('../models');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [Contact], // all contacts for each user [web:102]
      order: [['created_at', 'DESC']],
    });

    const transformed = users.map((user) => ({
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
      address_city: user.address_city,
      address_state: user.address_state,
      address_pincode: user.address_pincode,
      contacts: user.Contacts?.map((c) => ({
        id: c.id,
        userId: c.user_id,
        name: c.name,
        email: c.email,
        mobile: c.mobile,
        address_city: c.address_city,
        address_state: c.address_state,
        address_pincode: c.address_pincode,
        type: c.type,
        contactType: c.type,
      })) || [],
    }));

    res.json({ success: true, users: transformed });
  } catch (error) {
    console.error('Get users error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch users' });
  }
};

// Get single user (admin only)
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [Contact],
    }); // [web:138]

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: 'User not found' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
      address_city: user.address_city,
      address_state: user.address_state,
      address_pincode: user.address_pincode,
      contacts: user.Contacts?.map((c) => ({
        id: c.id,
        userId: c.user_id,
        name: c.name,
        email: c.email,
        mobile: c.mobile,
        address_city: c.address_city,
        address_state: c.address_state,
        address_pincode: c.address_pincode,
        type: c.type,
        contactType: c.type,
      })) || [],
    };

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch user' });
  }
};

// Create user (admin only) + Contact
// Can create internal staff OR portal customer
const createUser = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      name,
      email,
      password,
      mobile,
      address_city,
      address_state,
      address_pincode,
      role, // 'internal' | 'portal'
    } = req.body;

    if (!name || !email || !password || !role) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Name, email, password and role are required',
      });
    }

    if (!['internal', 'portal'].includes(role)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Role must be either internal or portal',
      });
    }

    if (password.length < 6) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    const existing = await User.findOne({
      where: { email },
      transaction: t,
    });

    if (existing) {
      await t.rollback();
      return res
        .status(400)
        .json({ success: false, error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // [web:128]

    // 1) Create user
    const user = await User.create(
      {
        name,
        role,
        email,
        password: hashedPassword,
        mobile: mobile || null,
        address_city: address_city || null,
        address_state: address_state || null,
        address_pincode: address_pincode || null,
      },
      { transaction: t }
    ); // [web:283]

    // 2) Create linked contact
    const contactType = role === 'portal' ? 'customer' : 'vendor';

    const contact = await Contact.create(
      {
        user_id: user.id,
        name,
        email,
        mobile: mobile || null,
        address_city: address_city || null,
        address_state: address_state || null,
        address_pincode: address_pincode || null,
        type: contactType,
      },
      { transaction: t }
    ); // [web:67]

    await t.commit();

    res.status(201).json({
      success: true,
      user: {
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
          userId: contact.user_id,
          name: contact.name,
          email: contact.email,
          mobile: contact.mobile,
          address_city: contact.address_city,
          address_state: contact.address_state,
          address_pincode: contact.address_pincode,
          type: contact.type,
          contactType: contact.type,
        },
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    await t.rollback();

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(400)
        .json({ success: false, error: 'Email already exists' });
    }

    res
      .status(500)
      .json({ success: false, error: 'Failed to create user' });
  }
};

// Update user (admin only) + keep its main contact in sync
// Here we assume each user has exactly one "primary" contact row (the one with user_id = user.id)
const updateUser = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      name,
      email,
      mobile,
      address_city,
      address_state,
      address_pincode,
      role,
    } = req.body;

    const user = await User.findByPk(id, { transaction: t });

    if (!user) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, error: 'User not found' });
    }

    // Update user
    await user.update(
      {
        name: name ?? user.name,
        email: email ?? user.email,
        mobile: mobile ?? user.mobile,
        address_city: address_city ?? user.address_city,
        address_state: address_state ?? user.address_state,
        address_pincode: address_pincode ?? user.address_pincode,
        role: role ?? user.role,
      },
      { transaction: t }
    ); // [web:199][web:211]

    // Keep the primary contact (if any) in sync
    const contact = await Contact.findOne({
      where: { user_id: user.id },
      transaction: t,
    }); // [web:173]

    if (contact) {
      await contact.update(
        {
          name: name ?? contact.name,
          email: email ?? contact.email,
          mobile: mobile ?? contact.mobile,
          address_city: address_city ?? contact.address_city,
          address_state: address_state ?? contact.address_state,
          address_pincode: address_pincode ?? contact.address_pincode,
          // type: keep as-is; or adjust based on role if you want
        },
        { transaction: t }
      );
    }

    await t.commit();
    await user.reload({ include: [Contact] });

    const result = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      mobile: user.mobile,
      address_city: user.address_city,
      address_state: user.address_state,
      address_pincode: user.address_pincode,
      contacts: user.Contacts?.map((c) => ({
        id: c.id,
        userId: c.user_id,
        name: c.name,
        email: c.email,
        mobile: c.mobile,
        address_city: c.address_city,
        address_state: c.address_state,
        address_pincode: c.address_pincode,
        type: c.type,
        contactType: c.type,
      })) || [],
    };

    res.json({ success: true, user: result });
  } catch (error) {
    console.error('Update user error:', error);
    await t.rollback();

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(400)
        .json({ success: false, error: 'Email already exists' });
    }

    res
      .status(500)
      .json({ success: false, error: 'Failed to update user' });
  }
};

// Delete user (admin only) + cascade contacts
// Your DB already has ON DELETE CASCADE from contacts.user_id → users.id
const deleteUser = async (req, res) => {
  const t = await sequelize.transaction(); // [web:75][web:73]

  try {
    const { id } = req.params;

    const user = await User.findByPk(id, { transaction: t });

    if (!user) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, error: 'User not found' });
    }

    // This will also delete all contacts with user_id = user.id because of FK cascade
    await user.destroy({ transaction: t }); // [web:253]

    await t.commit();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    await t.rollback();
    res
      .status(500)
      .json({ success: false, error: 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
