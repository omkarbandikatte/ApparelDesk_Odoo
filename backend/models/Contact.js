const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Contact Model
 * Represents customers and vendors
 * Contact type: 'customer', 'vendor', or 'both'
 * When user signs up, a Contact record is created with type='customer'
 * Contacts are used across all business documents (Sale Orders, Purchase Orders, Invoices, Bills)
 */
const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    comment: 'Links to User if this contact is a registered user',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contactType: {
    type: DataTypes.ENUM('customer', 'vendor', 'both'),
    allowNull: false,
    defaultValue: 'customer',
    comment: 'Type of contact: customer, vendor, or both',
  },
}, {
  tableName: 'contacts',
  timestamps: true,
});

module.exports = Contact;

