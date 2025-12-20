const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * VendorBill Model
 * Generated from confirmed purchase orders
 * When bill is confirmed, stock is increased
 * Status: draft, confirmed, paid, cancelled
 */
const VendorBill = sequelize.define('VendorBill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  billNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique bill number (e.g., BILL-001)',
  },
  purchaseOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'purchase_orders',
      key: 'id',
    },
    comment: 'Source purchase order',
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
  billDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Payment due date',
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
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total amount paid so far',
  },
  status: {
    type: DataTypes.ENUM('draft', 'confirmed', 'paid', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft',
  },
  stockIncreased: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether stock has been increased (happens on confirmation)',
  },
}, {
  tableName: 'vendor_bills',
  timestamps: true,
});

module.exports = VendorBill;

