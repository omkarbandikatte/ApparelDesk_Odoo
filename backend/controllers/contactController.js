const { Contact, User } = require('../models');
const sequelize = require('../config/database');

// Get all contacts (admin only)
// Get all contacts (admin only)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      include: [{
        model: User,
        // no "as" because you chose option A and defined:
        // User.hasMany(Contact, { foreignKey: 'user_id' });
        // Contact.belongsTo(User, { foreignKey: 'user_id' });
        attributes: ['id', 'email', 'role'],
      }],
      order: [['created_at', 'DESC']], // snake_case column in DB
    });

    const transformedContacts = contacts.map(contact => ({
      id: contact.id,
      userId: contact.user_id, // FK
      name: contact.name,
      email: contact.email,
      mobile: contact.mobile,
      address_city: contact.address_city,
      address_state: contact.address_state,
      address_pincode: contact.address_pincode,
      type: contact.type,       // 'customer' | 'vendor' | 'both'
      contactType: contact.type,
      user: contact.User
        ? {
            id: contact.User.id,
            email: contact.User.email,
            role: contact.User.role,
          }
        : null,
    }));

    res.json({ success: true, contacts: transformedContacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch contacts' });
  }
};


// Get single contact
const getContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id, {
      include: [ {
        model: User,
        attributes: ['id', 'email', 'role'], // no "as", and use role
      } ],
    }); // [web:103][web:138]

    if (!contact) {
      return res
        .status(404)
        .json({ success: false, error: 'Contact not found' });
    }

    res.json({
      success: true,
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
        user: contact.User
          ? {
              id: contact.User.id,
              email: contact.User.email,
              role: contact.User.role,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch contact' });
  }
};



// Create contact (admin only)
const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address_city,
      address_state,
      address_pincode,
      type, // 'vendor' | 'customer' | 'both' (for this route you'll mainly use 'vendor')
    } = req.body;

    // Basic validation
    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, error: 'Name and email are required' });
    }

    // This route is admin-only, so req.user is the admin (from authenticate + requireAdmin)
    const userId = req.user ? req.user.id : null;

    const contact = await Contact.create({
      user_id: userId,                         // admin who created this vendor
      name,
      email,
      mobile: mobile || null,
      address_city: address_city || null,
      address_state: address_state || null,
      address_pincode: address_pincode || null,
      type: type || 'vendor',                  // default to vendor
    }); // [web:212][web:56]

    res.status(201).json({
      success: true,
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
    });
  } catch (error) {
    console.error('Create contact error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(400)
        .json({ success: false, error: 'Email already exists' });
    }
    res
      .status(500)
      .json({ success: false, error: 'Failed to create contact' });
  }
};


// Update contact (admin only)
//  // adjust import to your setup


const updateContact = async (req, res) => {
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
      type,
    } = req.body;

    const contact = await Contact.findByPk(id, { transaction: t });

    if (!contact) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, error: 'Contact not found' });
    }

    // 1) Always update the contact itself
    await contact.update(
      {
        name: name ?? contact.name,
        email: email ?? contact.email,
        mobile: mobile ?? contact.mobile,
        address_city: address_city ?? contact.address_city,
        address_state: address_state ?? contact.address_state,
        address_pincode: address_pincode ?? contact.address_pincode,
        type: type ?? contact.type,
      },
      { transaction: t }
    ); // updated_at auto-handled [web:199][web:233]

    // 2) Optionally update the linked user, but only if it's a portal user
    if (contact.user_id) {
      const user = await User.findByPk(contact.user_id, { transaction: t });

      if (user && user.role === 'portal') {
        // Portal customer -> keep user in sync with contact
        await user.update(
          {
            name: name ?? user.name,
            email: email ?? user.email,
            mobile: mobile ?? user.mobile,
            address_city: address_city ?? user.address_city,
            address_state: address_state ?? user.address_state,
            address_pincode: address_pincode ?? user.address_pincode,
          },
          { transaction: t }
        );
      }
      // If user.role === 'internal', do nothing: admin’s own data stays unchanged
    }

    await t.commit();
    await contact.reload();

    res.json({
      success: true,
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
    });
  } catch (error) {
    console.error('Update contact error:', error);
    await t.rollback();

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res
        .status(400)
        .json({ success: false, error: 'Email already exists' });
    }

    res
      .status(500)
      .json({ success: false, error: 'Failed to update contact' });
  }
};



const deleteContact = async (req, res) => {
  const t = await sequelize.transaction(); // [web:73][web:275]

  try {
    const { id } = req.params;

    // Load contact with its linked user
    const contact = await Contact.findByPk(id, {
      include: [User],
      transaction: t,
    });

    if (!contact) {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, error: 'Contact not found' });
    }

    if (contact.user_id && contact.User && contact.User.role === 'portal') {
      await contact.User.destroy({ transaction: t }); 
    }

    await contact.destroy({ transaction: t }); 

    await t.commit();

    return res.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    await t.rollback();
    return res
      .status(500)
      .json({ success: false, error: 'Failed to delete contact' });
  }
};


module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};

