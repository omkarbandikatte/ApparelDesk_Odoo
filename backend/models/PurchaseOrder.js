const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * PurchaseOrder Model
 * Represents vendor purchase orders
 * Created manually by admin
 * Status: draft, confirmed, cancelled
 */
const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique order number (e.g., PO-001)',
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contacts',
      key: 'id',
    },
    comment: 'Vendor contact',
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('draft', 'confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft',
  },
}, {
  tableName: 'purchase_orders',
  timestamps: true,
});

module.exports = PurchaseOrder;

