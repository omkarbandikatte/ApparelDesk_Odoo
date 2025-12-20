const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * User Model
 * Represents system users (both customers and admin/seller users)
 * Users authenticate to the system
 * 
 * Role Logic:
 * - isAdmin = false: Customer (can shop, place orders, view invoices)
 * - isAdmin = true: Seller/Admin (can access admin panel, manage products, orders, inventory)
 * 
 * Signup Flow:
 * - If role='seller': User(isAdmin=true) + Contact(type=vendor)
 * - If role='customer': User(isAdmin=false) + Contact(type=customer)
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'true = Seller/Admin (access admin panel), false = Customer (shop and purchase)',
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;

