const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Payment Model
 * Unified payment records
 * Can be linked to CustomerInvoice or VendorBill
 * Supports partial and full payments
 */
const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paymentNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Unique payment number (e.g., PAY-001)',
  },
  contactId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'contacts',
      key: 'id',
    },
    comment: 'Contact (customer or vendor)',
  },
  customerInvoiceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'customer_invoices',
      key: 'id',
    },
    comment: 'If payment is for customer invoice',
  },
  vendorBillId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'vendor_bills',
      key: 'id',
    },
    comment: 'If payment is for vendor bill',
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Payment amount',
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'bank_transfer', 'card', 'cheque'),
    allowNull: false,
    defaultValue: 'cash',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'payments',
  timestamps: true,
});

module.exports = Payment;

