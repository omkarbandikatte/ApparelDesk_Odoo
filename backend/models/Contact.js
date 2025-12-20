const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('customer', 'vendor', 'both'),
    allowNull: false,
    defaultValue: 'customer',
    comment: 'Type of contact: customer, vendor, or both',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  mobile: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  address_city: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  address_state: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  address_pincode: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  tableName: 'contacts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Contact;
