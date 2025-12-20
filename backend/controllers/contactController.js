const { Contact, User } = require('../models');

// Get all contacts (admin only)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'isAdmin'],
      }],
      order: [['createdAt', 'DESC']],
    });

    const transformedContacts = contacts.map(contact => ({
      id: contact.id,
      userId: contact.userId,
      name: contact.name,
      email: contact.email,
      mobile: contact.mobile,
      address: contact.address,
      type: contact.contactType,
      contactType: contact.contactType,
      user: contact.user ? {
        id: contact.user.id,
        email: contact.user.email,
        isAdmin: contact.user.isAdmin,
      } : null,
    }));

    res.json({ success: true, contacts: transformedContacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contacts' });
  }
};

// Get single contact
const getContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'isAdmin'],
      }],
    });

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    res.json({
      success: true,
      contact: {
        id: contact.id,
        userId: contact.userId,
        name: contact.name,
        email: contact.email,
        mobile: contact.mobile,
        address: contact.address,
        type: contact.contactType,
        contactType: contact.contactType,
        user: contact.user ? {
          id: contact.user.id,
          email: contact.user.email,
          isAdmin: contact.user.isAdmin,
        } : null,
      },
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contact' });
  }
};

// Create contact (admin only)
const createContact = async (req, res) => {
  try {
    const { name, email, mobile, address, type } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const contact = await Contact.create({
      name,
      email,
      mobile: mobile || null,
      address: address || null,
      contactType: type || 'customer',
    });

    res.status(201).json({
      success: true,
      contact: {
        id: contact.id,
        userId: contact.userId,
        name: contact.name,
        email: contact.email,
        mobile: contact.mobile,
        address: contact.address,
        type: contact.contactType,
        contactType: contact.contactType,
      },
    });
  } catch (error) {
    console.error('Create contact error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    res.status(500).json({ success: false, error: 'Failed to create contact' });
  }
};

// Update contact (admin only)
const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile, address, type } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    await contact.update({
      name: name || contact.name,
      email: email || contact.email,
      mobile: mobile !== undefined ? mobile : contact.mobile,
      address: address !== undefined ? address : contact.address,
      contactType: type || contact.contactType,
    });

    res.json({
      success: true,
      contact: {
        id: contact.id,
        userId: contact.userId,
        name: contact.name,
        email: contact.email,
        mobile: contact.mobile,
        address: contact.address,
        type: contact.contactType,
        contactType: contact.contactType,
      },
    });
  } catch (error) {
    console.error('Update contact error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }
    res.status(500).json({ success: false, error: 'Failed to update contact' });
  }
};

// Delete contact (admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }

    await contact.destroy();
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete contact' });
  }
};

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};

